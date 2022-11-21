
//import { Controller, Get, Post } from 'npm:@overnightjs/core@^1.7.6';
import { Application, Request, Response } from 'npm:@types/express@^4.17.13';
import { Logger } from 'npm:tslog@^3.3.3';

import { LocalGateway, RemoteNode } from 'npm:jitar@^0.2.0';

import NodeDto from '../models/NodeDto.ts';
import DataConverter from '../utils/DataConverter.ts';

//@Controller('nodes')
export default class NodesController
{
    #gateway: LocalGateway;
    #logger: Logger;

    constructor(app: Application, gateway: LocalGateway, logger: Logger)
    {
        this.#gateway = gateway;
        this.#logger = logger;

        app.get('/nodes', (request: Request, response: Response) => { this.#getNodes(request, response) });
        app.post('/nodes', (request: Request, response: Response) => { this.#add(request, response) });
    }

    //@Get()
    async #getNodes(request: Request, response: Response): Promise<Response>
    {
        const nodes = this.#gateway.nodes.map(node => { return { url: node.url, procedureNames: node.getProcedureNames() }; });

        this.#logger.info('Got nodes');

        return response.status(200).send(nodes);
    }

    //@Post()
    async #add(request: Request, response: Response): Promise<Response>
    {
        try
        {
            const nodeDto = await DataConverter.convert(NodeDto, request.body) as NodeDto;
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
