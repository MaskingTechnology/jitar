
import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from 'tslog';

import LocalNode from '../../runtime/LocalNode.js';
import Proxy from '../../runtime/Proxy.js';

@Controller('health')
export default class HealthController
{
    #node: LocalNode | Proxy;
    #logger: Logger;

    constructor(node: LocalNode | Proxy, logger: Logger)
    {
        this.#node = node;
        this.#logger = logger;
    }

    @Get()
    async getHealth(request: Request, response: Response): Promise<Response>
    {
        const health = await this.#node.getHealth();
        const data = Object.fromEntries(health);

        this.#logger.debug('Got health');

        return response.status(200).send(data);
    }

    @Get('status')
    async isHealthy(request: Request, response: Response): Promise<Response>
    {
        const healthy = await this.#node.isHealthy();

        this.#logger.debug('Got health status');

        return response.status(200).send(healthy);
    }
}
