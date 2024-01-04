
import express, { Request, Response } from 'express';
import { Logger } from 'tslog';

import { ClientIdHelper, LocalRepository, Standalone } from '@jitar/runtime';
import { Serializer } from '@jitar/serialization';

import Headers from '../definitions/Headers.js';

const clientIdHelper = new ClientIdHelper();

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

        app.post('/modules', (request: Request, response: Response) => { this.registerClient(request, response); });
        app.get('/modules/:clientId/*', (request: Request, response: Response) => { this.getModule(request, response); });
    }

    async registerClient(request: Request, response: Response): Promise<Response>
    {
        this.#logger.info('Register client');

        if ((request.body instanceof Array) === false)
        {
            return response.status(400).send('Invalid segment file list.');
        }

        const segmentFiles = request.body as string[];

        const clientId = await this.#repository.registerClient(segmentFiles);

        this.#logger.info(`Registered client -> ${clientId} [${segmentFiles.join(',')}]`);

        return response.status(200).type('text').send(clientId);
    }

    async getModule(request: Request, response: Response): Promise<Response>
    {
        this.#logger.info(`Get module for -> '${request.params.clientId}'`);

        const clientId = request.params.clientId;

        if (typeof clientId !== 'string' || clientIdHelper.validate(clientId) === false)
        {
            return response.status(400).type('text').send('Invalid client id.');
        }

        const pathKey = `/${clientId}/`;
        const pathIndex = request.path.indexOf(pathKey) + pathKey.length;
        const filename = request.path.substring(pathIndex);

        try
        {
            const file = await this.#repository.readModule(filename, clientId);

            this.#logger.info(`Got module -> '${filename}' (${clientId})`);

            response.set(Headers.CONTENT_TYPE, file.type);

            return response.status(200).send(file.content);
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            this.#logger.error(`Failed to get module -> '${filename}' (${clientId}) | ${message}`);

            const data = this.#serializer.serialize(error);

            return response.status(500).type('json').send(data);
        }
    }
}
