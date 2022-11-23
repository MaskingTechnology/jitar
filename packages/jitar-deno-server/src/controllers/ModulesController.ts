
import { Application, Request, Response } from 'npm:@types/express@^4.17.13';
import { Logger } from 'npm:tslog@^3.3.3';

import { ClientId, LocalRepository, Proxy, ValueSerializer } from 'npm:jitar@^0.2.0';

export default class ModulesController
{
    #repository: LocalRepository | Proxy;
    #logger: Logger;

    constructor(app: Application, repository: LocalRepository | Proxy, logger: Logger)
    {
        this.#repository = repository;
        this.#logger = logger;

        app.post('/modules', (request: Request, response: Response) => { this.#registerClient(request, response) });
        app.get('/modules/:clientId/*', (request: Request, response: Response) => { this.#getModule(request, response) });
    }

    async #registerClient(request: Request, response: Response): Promise<Response>
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

    async #getModule(request: Request, response: Response): Promise<Response>
    {
        const clientId = request.params.clientId;

        if (typeof clientId !== 'string' || ClientId.validate(clientId) === false)
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

            const data = ValueSerializer.serialize(error);

            response.header('Content-Type', 'application/json');

            return response.status(500).send(data);
        }
    }
}
