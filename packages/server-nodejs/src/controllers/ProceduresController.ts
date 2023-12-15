
import express, { Request, Response } from 'express';
import { Logger } from 'tslog';

import { LocalGateway, LocalNode, Standalone } from '@jitar/runtime';

export default class ProceduresController
{
    #runtime: LocalGateway | LocalNode | Standalone;
    #logger: Logger<unknown>;

    constructor(app: express.Application, runtime: LocalGateway | LocalNode | Standalone, logger: Logger<unknown>)
    {
        this.#runtime = runtime;
        this.#logger = logger;

        app.get('/procedures', (request: Request, response: Response) => { this.getProcedureNames(request, response); });
    }

    async getProcedureNames(request: Request, response: Response): Promise<Response>
    {
        const names = this.#runtime.getProcedureNames();

        this.#logger.info('Got procedure names');

        return response.status(200).send(names);
    }
}
