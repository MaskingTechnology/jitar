
import express, { Request, Response } from 'express';
import { Logger } from 'tslog';

import { LocalRepository, Standalone, FileNotFound } from '@jitar/runtime';

import Headers from '../definitions/Headers.js';

export default class AssetsController
{
    #repository: LocalRepository | Standalone;
    #indexFile: string;
    #logger: Logger<unknown>;

    constructor(app: express.Application, repository: LocalRepository | Standalone, indexFile: string, logger: Logger<unknown>)
    {
        this.#repository = repository;
        this.#indexFile = indexFile;
        this.#logger = logger;

        app.get('*', (request: Request, response: Response) => { this.#getContent(request, response); });
    }

    async #getContent(request: Request, response: Response): Promise<void>
    {
        this.#logger.info(`Got asset -> '${request.path}'`);

        const path = request.path.substring(1).trim();
        const filename = path.length === 0 ? this.#indexFile : path;

        try
        {
            const file = await this.#repository.readAsset(filename);

            response.setHeader(Headers.CONTENT_TYPE, file.type);
            response.status(200).send(file.content);
        }
        catch (error: unknown)
        {
            if (error instanceof FileNotFound)
            {
                this.#logger.warn(`Failed to get asset -> '${filename}' | ${error.message}`);

                response.status(404).send(error.message);

                return;
            }

            const message = error instanceof Error ? error.message : String(error);

            this.#logger.error(`Failed to get file content -> '${filename}' | ${message}`);

            response.status(500).send(message);
        }
    }
}
