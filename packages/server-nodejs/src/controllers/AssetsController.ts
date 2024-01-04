
import express, { Request, Response } from 'express';
import { Logger } from 'tslog';

import { LocalRepository, Standalone, FileNotFound, BadRequest } from '@jitar/runtime';

import ContentTypes from '../definitions/ContentTypes.js';
import Headers from '../definitions/Headers.js';
import StringSanitizer from '../utils/StringSanitizer.js';

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
        let filename = '';
        const path = request.path.substring(1).trim();

        try
        {
            const decodedPath = decodeURIComponent(path);

            filename = decodedPath.length === 0 ? this.#indexFile : decodedPath;
            
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
                this.#logger.warn(`Failed to get asset -> '${filename}' | ${error.message}`);

                const cleanMessage = StringSanitizer.sanitize(error.message);
                response.setHeader(Headers.CONTENT_TYPE, ContentTypes.TEXT);

                return response.status(404).send(cleanMessage);
            }

            const message = error instanceof Error ? error.message : String(error);
            const cleanMessage = StringSanitizer.sanitize(message);

            this.#logger.error(`Failed to get file content -> '${filename}' | ${message}`);

            response.setHeader(Headers.CONTENT_TYPE, ContentTypes.TEXT);
            
            return response.status(500).send(cleanMessage);
        }
    }
}
