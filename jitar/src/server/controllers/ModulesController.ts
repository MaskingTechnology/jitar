
import { Controller, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from 'tslog';

import LocalRepository from '../../runtime/LocalRepository.js';
import Proxy from '../../runtime/Proxy.js';
import ValueSerializer from '../../runtime/serialization/ValueSerializer.js';

@Controller('modules')
export default class ModulesController
{
    #repository: LocalRepository | Proxy;
    #logger: Logger;

    constructor(repository: LocalRepository | Proxy, logger: Logger)
    {
        this.#repository = repository;
        this.#logger = logger;
    }

    @Post()
    async registerClient(request: Request, response: Response): Promise<Response>
    {
        const segmentFiles = request.body as string[];

        const clientId = await this.#repository.registerClient(segmentFiles);

        this.#logger.info(`Registered client -> ${clientId} [${segmentFiles.join(',')}]`);

        return response.status(200).send(clientId);
    }

    @Get(':clientId/*')
    async getModule(request: Request, response: Response): Promise<Response>
    {
        const clientId = request.params.clientId;

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

            const data = ValueSerializer.serialize(error);

            response.setHeader('Content-Type', 'application/json');

            return response.status(500).send(data);
        }
    }
}
