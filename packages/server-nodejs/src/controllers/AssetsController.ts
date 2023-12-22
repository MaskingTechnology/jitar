
import express, { Request, Response } from 'express';
import { Logger } from 'tslog';

import { LocalRepository, Standalone, FileNotFound, BadRequest } from '@jitar/runtime';

import ContentTypes from '../definitions/ContentTypes.js';
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

    async #getContent(request: Request, response: Response): Promise<Response>
    {
        try
        {
            const path = request.path.substring(1).trim();
            const decodedPath = this.#decodePath(path);
            const filename = decodedPath.length === 0 ? this.#indexFile : decodedPath;

            const file = await this.#repository.readAsset(filename);

            this.#logger.info(`Got asset -> '${filename}'`);

            if (file.type === ContentTypes.HTML)
            {
                response.setHeader(Headers.FRAME_OPTIONS, 'DENY');
            }

            response.setHeader(Headers.CONTENT_TYPE, file.type);

            return response.status(200).send(file.content);
        }
        catch (error: unknown)
        {
            if (error instanceof FileNotFound)
            {
                this.#logger.warn(`Failed to get asset -> ${error.message}`);

                response.setHeader(Headers.CONTENT_TYPE, ContentTypes.TEXT);

                return response.status(404).send(error.message);
            }

            if (error instanceof BadRequest)
            {
                this.#logger.warn(`Invalid path -> ${error.message}`);

                response.setHeader(Headers.CONTENT_TYPE, ContentTypes.TEXT);

                return response.status(400).send(error.message);
            }

            const message = error instanceof Error ? error.message : String(error);

            this.#logger.error(`Failed to get file content -> ${message}`);

            response.setHeader(Headers.CONTENT_TYPE, ContentTypes.TEXT);
            
            return response.status(500).send(message);
        }
    }

    #decodePath(path: string): string
    {
        const decodedPath = decodeURIComponent(path);

        if (decodedPath.includes('..'))
        {
            throw new BadRequest(`Invalid path '${decodedPath}'`);
        }

        return decodedPath;
    }
}
