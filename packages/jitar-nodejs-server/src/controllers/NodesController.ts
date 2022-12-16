
import { Controller, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from 'tslog';

import { LocalGateway, RemoteNode } from 'jitar';

import NodeDto from '../models/NodeDto.js';
import DataConverter from '../utils/DataConverter.js';

@Controller('nodes')
export default class NodesController
{
    #gateway: LocalGateway;
    #logger: Logger<unknown>;

    constructor(gateway: LocalGateway, logger: Logger<unknown>)
    {
        this.#gateway = gateway;
        this.#logger = logger;
    }

    @Get()
    async getNodes(request: Request, response: Response): Promise<Response>
    {
        const nodes = this.#gateway.nodes.map(node => { return { url: node.url, procedureNames: node.getProcedureNames() }; });

        this.#logger.info('Got nodes');

        return response.status(200).send(nodes);
    }

    @Post()
    async add(request: Request, response: Response): Promise<Response>
    {
        try
        {
            const nodeDto = await DataConverter.convert(NodeDto, request.body);
            const node = new RemoteNode(nodeDto.url, nodeDto.procedureNames);

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
