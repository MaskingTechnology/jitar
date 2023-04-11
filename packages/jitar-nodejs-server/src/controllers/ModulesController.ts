
import { Controller, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from 'tslog';

import { ClientIdHelper, LocalRepository, Proxy } from '@jitar/runtime';
import { Serializer } from '@jitar/serialization';

const clientIdHelper = new ClientIdHelper();

@Controller('modules')
export default class ModulesController
{
    #repository: LocalRepository | Proxy;
    #serializer: Serializer;
    #logger: Logger<unknown>;

    constructor(repository: LocalRepository | Proxy, serializer: Serializer, logger: Logger<unknown>)
    {
        this.#repository = repository;
        this.#serializer = serializer;
        this.#logger = logger;
    }

    @Post()
    async registerClient(request: Request, response: Response): Promise<Response>
    {
        if ((request.body instanceof Array) === false)
        {
            // TODO: Throw error.
        }

        const segmentFiles = request.body as string[];

        const clientId = await this.#repository.registerClient(segmentFiles);

        this.#logger.info(`Registered client -> ${clientId} [${segmentFiles.join(',')}]`);

        return response.status(200).send(clientId);
    }

    @Get(':clientId/*')
    async getModule(request: Request, response: Response): Promise<Response>
    {
        const clientId = request.params.clientId;

        if (typeof clientId !== 'string' || clientIdHelper.validate(clientId) === false)
        {
            return response.status(400).send('Invalid client id.');
        }

        const pathKey = `/${clientId}/`;
        const pathIndex = request.path.indexOf(pathKey) + pathKey.length;
        const filename = request.path.substring(pathIndex);

        try
        {
            const file = await this.#repository.loadModule(clientId, filename);

            this.#logger.info(`Got module -> '${filename}' (${clientId})`);

            response.set('Content-Type', file.type);

            return response.status(200).send(file.content);
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            this.#logger.error(`Failed to get module -> '${filename}' (${clientId}) | ${message}`);

            const data = this.#serializer.serialize(error);

            response.setHeader('Content-Type', 'application/json');

            return response.status(500).send(data);
        }
    }
}
