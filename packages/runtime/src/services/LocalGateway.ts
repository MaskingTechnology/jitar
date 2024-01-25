
import ProcedureNotFound from '../errors/ProcedureNotFound.js';

import Request from '../models/Request.js';
import Response from '../models/Response.js';

import Gateway from './Gateway.js';
import Node from './Node.js';
import NodeBalancer from './NodeBalancer.js';
import Repository from './Repository.js';

export default class LocalGateway extends Gateway
{
    #nodes: Set<Node> = new Set();
    #balancers: Map<string, NodeBalancer> = new Map();
    #secret?: string;

    constructor(repository: Repository, url?: string, secret?: string)
    {
        super(repository, url);

        this.#secret = secret;
    }

    get nodes()
    {
        return [...this.#nodes.values()];
    }

    getProcedureNames(): string[]
    {
        const procedureNames = this.nodes.map(node => node.getProcedureNames());
        const uniqueNames = new Set(procedureNames.flat());

        return [...uniqueNames.values()];
    }

    hasProcedure(fqn: string): boolean
    {
        const procedureNames = this.getProcedureNames();

        return procedureNames.includes(fqn);
    }

    async addNode(node: Node, secret?: string): Promise<void>
    {
        if (this.#secret !== secret)
        {
            throw new Error('Invalid secret');
        }

        this.#nodes.add(node);

        for (const name of node.getProcedureNames())
        {
            const balancer = this.#getOrCreateBalancer(name);

            balancer.addNode(node);
        }
    }

    removeNode(node: Node): void
    {
        this.#nodes.delete(node);

        for (const name of node.getProcedureNames())
        {
            const balancer = this.#getBalancer(name);

            if (balancer === undefined)
            {
                continue;
            }

            balancer.removeNode(node);
        }
    }

    #getBalancer(fqn: string): NodeBalancer | undefined
    {
        return this.#balancers.get(fqn);
    }

    #getOrCreateBalancer(fqn: string): NodeBalancer
    {
        let balancer = this.#getBalancer(fqn);

        if (balancer === undefined)
        {
            balancer = new NodeBalancer();

            this.#balancers.set(fqn, balancer);
        }

        return balancer;
    }

    run(request: Request): Promise<Response>
    {
        const balancer = this.#getBalancer(request.fqn);

        if (balancer === undefined)
        {
            throw new ProcedureNotFound(request.fqn);
        }

        return balancer.run(request);
    }
}
