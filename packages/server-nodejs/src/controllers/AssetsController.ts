
import express, { Request, Response } from 'express';
import { Logger } from 'tslog';

import { LocalRepository, Standalone, FileNotFound } from '@jitar/runtime';

import Headers from '../definitions/Headers.js';
import ContentTypes from '../definitions/ContentTypes.js';

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
        try
        {
            const path = request.path.substring(1).trim();
            const decodedPath = decodeURIComponent(path);
            const filename = decodedPath.length === 0 ? this.#indexFile : decodedPath;

            const file = await this.#repository.readAsset(filename);

            this.#logger.info(`Got asset -> '${request.path}'`);

            if (file.type === ContentTypes.HTML)
            {
                response.setHeader(Headers.FRAME_OPTIONS, 'DENY');
            }

            response.setHeader(Headers.CONTENT_TYPE, file.type);
            response.status(200).send(file.content);
        }
        catch (error: unknown)
        {
            if (error instanceof FileNotFound)
            {
                this.#logger.warn(`Failed to get asset ->  ${error.message}`);

                response.status(404).type('text').send(error.message);

                return;
            }

            const message = error instanceof Error ? error.message : 'Internal server error';

            this.#logger.error(`Failed to get file content -> ${message}`);

            response.status(500).type('text').send(message);
        }
    }
}
