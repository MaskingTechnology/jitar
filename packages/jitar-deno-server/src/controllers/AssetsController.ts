
//import { Controller } from 'npm:@overnightjs/core@^1.7.6';
import { Application, Request, Response } from 'npm:@types/express@^4.17.13';
import { Logger } from 'npm:tslog@^3.3.3';

import { FileNotFound, LocalRepository, Proxy } from 'npm:jitar@^0.2.0';

//@Controller('')
export default class AssetsController
{
    #repository: LocalRepository | Proxy;
    #indexFile: string;
    #logger: Logger;

    constructor(app: Application, repository: LocalRepository | Proxy, indexFile: string, logger: Logger)
    {
        this.#repository = repository;
        this.#indexFile = indexFile;
        this.#logger = logger;

        app.get('*', (request: Request, response: Response) => { this.#getContent(request, response) });
    }

    async #getContent(request: Request, response: Response): Promise<void>
    {
        this.#logger.info(`Got asset -> '${request.path}'`);

        const path = request.path.substring(1).trim();
        const filename = path.length === 0 ? this.#indexFile : path;

        try
        {
            const file = await this.#repository.loadAsset(filename);

            response.set('Content-Type', file.type);
            response.set('Content-Length', String(file.size));
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
