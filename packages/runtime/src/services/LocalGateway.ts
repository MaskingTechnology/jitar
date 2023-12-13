
import ProcedureNotFound from '../errors/ProcedureNotFound.js';

import Request from '../models/Request.js';
import Response from '../models/Response.js';

import Gateway from './Gateway.js';
import Node from './Node.js';
import NodeBalancer from './NodeBalancer.js';

export default class LocalGateway extends Gateway
{
    #nodes: Set<Node> = new Set();
    #balancers: Map<string, NodeBalancer> = new Map();

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

    start(): Promise<void>
    {
        return this.repository.start();
    }

    stop(): Promise<void>
    {
        return this.repository.stop();
    }

    async addNode(node: Node): Promise<void>
    {
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
