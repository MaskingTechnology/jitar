
import express, { Request, Response } from 'express';
import { Logger } from 'tslog';

import { LocalNode, Standalone } from '@jitar/runtime';
import Headers from '../definitions/Headers';
import ContentTypes from '../definitions/ContentTypes';

export default class HealthController
{
    #node: LocalNode | Standalone;
    #logger: Logger<unknown>;

    constructor(app: express.Application, node: LocalNode | Standalone, logger: Logger<unknown>)
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

        response.setHeader(Headers.CONTENT_TYPE, ContentTypes.TEXT);

        return response.status(200).send(healthy);
    }
}
