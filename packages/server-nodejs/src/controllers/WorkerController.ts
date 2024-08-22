
import express, { Request, Response } from 'express';
import { Logger } from 'tslog';

import { LocalGateway, RuntimeBuilder } from '@jitar/runtime';

import WorkerDto, { workerDtoSchema } from '../models/WorkerDto.js';
import DataConverter from '../utils/DataConverter.js';
import Headers from '../definitions/Headers.js';
import ContentTypes from '../definitions/ContentTypes.js';
import ConversionError from '../errors/ConversionError.js';

export default class WorkerController
{
    #gateway: LocalGateway;
    #runtimeBuilder: RuntimeBuilder;
    #logger: Logger<unknown>;

    constructor(app: express.Application, gateway: LocalGateway, runtimeBuilder: RuntimeBuilder, logger: Logger<unknown>)
    {
        this.#gateway = gateway;
        this.#runtimeBuilder = runtimeBuilder;
        this.#logger = logger;

        app.get('/workers', (request: Request, response: Response) => { this.getWorkers(request, response); });
        app.post('/workers', (request: Request, response: Response) => { this.addWorker(request, response); });
    }

    async getWorkers(request: Request, response: Response): Promise<Response>
    {
        const workers: object[] = [];//this.#gateway.workers.map(worker => { return { url: worker.url, procedureNames: worker.getProcedureNames() }; });

        this.#logger.info('Got workers');

        response.setHeader(Headers.CONTENT_TYPE, ContentTypes.JSON);

        return response.status(200).send(workers);
    }

    async addWorker(request: Request, response: Response): Promise<Response>
    {
        try
        {
            const workerDto = DataConverter.convert<WorkerDto>(workerDtoSchema, request.body);

            const worker = this.#runtimeBuilder.buildRemoteWorker(workerDto.url, workerDto.procedureNames);

            await this.#gateway.addWorker(worker, workerDto.trustKey);

            this.#logger.info(`Added worker -> ${worker.url}`);

            return response.status(201).send();
        }
        catch (error: unknown)
        {
            if (error instanceof ConversionError)
            {
                const message = error.message;

                this.#logger.warn(`Failed to add worker | ${message}`);

                return response.status(400).type('text').send(message);
            }

            const message = error instanceof Error ? error.message : 'Internal server error';

            this.#logger.error(`Failed to add worker | ${message}`);

            return response.status(500).type('text').send(message);
        }
    }
}
