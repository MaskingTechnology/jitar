
import ProcedureNotFound from '../errors/ProcedureNotFound.js';
import Version from '../models/Version.js';
import ModuleLoader from '../utils/ModuleLoader.js';

import Gateway from './Gateway.js';
import Node from './Node.js';
import NodeBalancer from './NodeBalancer.js';
import Repository from './Repository.js';

const NO_SEGMENTS: string[] = [];

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

    async setBaseUrl(repository: Repository): Promise<void>
    {
        const clientId = await repository.registerClient(NO_SEGMENTS);
        const moduleLocation = await repository.getModuleLocation(clientId);

        ModuleLoader.setBaseUrl(moduleLocation);
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

    async run(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>): Promise<unknown>
    {
        const balancer = this.#getBalancer(fqn);

        if (balancer === undefined)
        {
            throw new ProcedureNotFound(fqn);
        }

        return balancer.run(fqn, version, args, headers);
    }
}
