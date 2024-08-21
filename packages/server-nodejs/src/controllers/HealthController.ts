
import express, { Request, Response } from 'express';
import { Logger } from 'tslog';

import { LocalWorker } from '@jitar/runtime';
import Headers from '../definitions/Headers';
import ContentTypes from '../definitions/ContentTypes';

export default class HealthController
{
    #worker: LocalWorker;
    #logger: Logger<unknown>;

    constructor(app: express.Application, worker: LocalWorker, logger: Logger<unknown>)
    {
        this.#worker = worker;
        this.#logger = logger;

        app.get('/health', (request: Request, response: Response) => { this.getHealth(request, response); });
        app.get('/health/status', (request: Request, response: Response) => { this.isHealthy(request, response); });
    }

    async getHealth(request: Request, response: Response): Promise<Response>
    {
        const health = await this.#worker.getHealth();
        const data = Object.fromEntries(health);

        this.#logger.debug('Got health');

        return response.status(200).send(data);
    }

    async isHealthy(request: Request, response: Response): Promise<Response>
    {
        const healthy = await this.#worker.isHealthy();

        this.#logger.debug('Got health status');

        response.setHeader(Headers.CONTENT_TYPE, ContentTypes.TEXT);

        return response.status(200).send(healthy);
    }
}
