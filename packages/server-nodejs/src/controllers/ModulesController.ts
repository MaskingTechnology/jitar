
import express, { Request, Response } from 'express';
import { Logger } from 'tslog';

import { LocalRepository, Standalone } from '@jitar/runtime';
import { Serializer } from '@jitar/serialization';

import Headers from '../definitions/Headers';
import ContentTypes from '../definitions/ContentTypes';

export default class ModulesController
{
    #repository: LocalRepository | Standalone;
    #serializer: Serializer;
    #logger: Logger<unknown>;

    constructor(app: express.Application, repository: LocalRepository | Standalone, serializer: Serializer, logger: Logger<unknown>)
    {
        this.#repository = repository;
        this.#serializer = serializer;
        this.#logger = logger;

        app.get('/modules/*', (request: Request, response: Response) => { this.getModule(request, response); });
    }

    async getModule(request: Request, response: Response): Promise<Response>
    {
        //this.#logger.info(`Get module for -> '${caller}'`);

        const pathKey = '/modules';
        const specifier = request.path.substring(pathKey.length);

        try
        {
            const file = await this.#repository.readModule(specifier);

            this.#logger.info(`Got module -> '${specifier}'`);

            response.setHeader(Headers.CONTENT_TYPE, file.type);

            return response.status(200).send(file.content);
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            this.#logger.error(`Failed to get module -> '${specifier}' | ${message}`);

            const data = this.#serializer.serialize(error);

            response.setHeader(Headers.CONTENT_TYPE, ContentTypes.JSON);

            return response.status(500).send(data);
        }
    }
}
