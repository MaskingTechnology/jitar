
import express, { Request, Response } from 'express';
import { Logger } from 'tslog';

import { LocalGateway, RemoteNode } from '@jitar/runtime';

import NodeDto, { nodeDtoSchema } from '../models/NodeDto.js';
import DataConverter from '../utils/DataConverter.js';

export default class NodesController
{
    #gateway: LocalGateway;
    #logger: Logger<unknown>;

    constructor(app: express.Application, gateway: LocalGateway, logger: Logger<unknown>)
    {
        this.#gateway = gateway;
        this.#logger = logger;

        app.get('/nodes', (request: Request, response: Response) => { this.getNodes(request, response); });
        app.post('/nodes', (request: Request, response: Response) => { this.add(request, response); });
    }

    async getNodes(request: Request, response: Response): Promise<Response>
    {
        const nodes = this.#gateway.nodes.map(node => { return { url: node.url, procedureNames: node.getProcedureNames() }; });

        this.#logger.info('Got nodes');

        return response.status(200).send(nodes);
    }

    async add(request: Request, response: Response): Promise<Response>
    {
        try
        {
            const nodeDto = DataConverter.convert<NodeDto>(nodeDtoSchema, request.body);
            const node = new RemoteNode(nodeDto.procedureNames, nodeDto.url);

            this.#gateway.addNode(node);

            this.#logger.info(`Added node -> ${node.url}`);

            return response.status(201).send();
        }
        catch (error: unknown)
        {
            const status = error instanceof Array ? 400 : 500;
            const message = error instanceof Error ? error.message : String(error);

            this.#logger.error(`Failed to add node | ${message}`);

            return response.status(status).send(error);
        }
    }
}
