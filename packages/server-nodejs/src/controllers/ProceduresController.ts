
import express, { Request, Response } from 'express';
import { Logger } from 'tslog';

import { LocalGateway, LocalWorker } from '@jitar/runtime';

import Headers from '../definitions/Headers';
import ContentTypes from '../definitions/ContentTypes';

export default class ProceduresController
{
    #runtime: LocalGateway | LocalWorker;
    #logger: Logger<unknown>;

    constructor(app: express.Application, runtime: LocalGateway | LocalWorker, logger: Logger<unknown>)
    {
        this.#runtime = runtime;
        this.#logger = logger;

        app.get('/procedures', (request: Request, response: Response) => { this.getProcedureNames(request, response); });
    }

    async getProcedureNames(request: Request, response: Response): Promise<Response>
    {
        const names = this.#runtime.getProcedureNames();

        this.#logger.info('Got procedure names');

        response.setHeader(Headers.CONTENT_TYPE, ContentTypes.JSON);

        return response.status(200).send(names);
    }
}
