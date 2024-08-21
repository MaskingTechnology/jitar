
import { Application, Request, Response } from 'express';
import { Logger } from 'tslog';

import { LocalRepository, FileNotFound } from '@jitar/runtime';

import Headers from '../definitions/Headers.js';
import ContentTypes from '../definitions/ContentTypes.js';

export default class AssetsController
{
    #repository: LocalRepository;
    #indexFile: string;
    #serveIndexOnNotFound: boolean;
    #logger: Logger<unknown>;

    constructor(app: Application, repository: LocalRepository, indexFile: string, serveIndexOnNotFound: boolean, logger: Logger<unknown>)
    {
        this.#repository = repository;
        this.#indexFile = indexFile;
        this.#serveIndexOnNotFound = serveIndexOnNotFound;
        this.#logger = logger;

        app.get('*', (request: Request, response: Response) => { this.#getContent(request, response); });
    }

    async #getContent(request: Request, response: Response): Promise<void>
    {
        const path = request.path.substring(1).trim();
        const decodedPath = decodeURIComponent(path);
        const filename = decodedPath.length === 0 ? this.#indexFile : decodedPath;

        this.#loadContent(filename, response);
    }

    async #loadContent(filename: string, response: Response): Promise<void>
    {
        try
        {
            const file = await this.#repository.readAsset(filename);

            this.#logger.info(`Got asset -> '${filename}'`);

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
                if (this.#serveIndexOnNotFound && filename !== this.#indexFile)
                {
                    return this.#loadContent(this.#indexFile, response);
                }

                this.#logger.warn(`Failed to get asset -> '${filename}'`);

                response.status(404).type('text').send('Not found');

                return;
            }

            const message = error instanceof Error ? error.message : 'Internal server error';

            this.#logger.error(`Failed to get asset -> ${message}`);

            response.status(500).type('text').send(message);
        }
    }
}
