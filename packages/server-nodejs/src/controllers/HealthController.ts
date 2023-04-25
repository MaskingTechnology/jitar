
import express, { Request, Response } from 'express';
import { Logger } from 'tslog';

import { LocalNode, Proxy } from '@jitar/runtime';

export default class HealthController
{
    #node: LocalNode | Proxy;
    #logger: Logger<unknown>;

    constructor(app: express.Application, node: LocalNode | Proxy, logger: Logger<unknown>)
    {
        this.#node = node;
        this.#logger = logger;

        app.get('/health', (request: Request, response: Response) => { this.getHealth(request, response); });
        app.get('/health/status', (request: Request, response: Response) => { this.isHealthy(request, response); });
    }

    async getHealth(request: Request, response: Response): Promise<Response>
    {
        const health = await this.#node.getHealth();
        const data = Object.fromEntries(health);

        this.#logger.debug('Got health');

        return response.status(200).send(data);
    }

    async isHealthy(request: Request, response: Response): Promise<Response>
    {
        const healthy = await this.#node.isHealthy();

        this.#logger.debug('Got health status');

        return response.status(200).send(healthy);
    }
}
