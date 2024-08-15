
import InvalidTrustKey from '../errors/InvalidTrustKey.js';
import ProcedureNotFound from '../errors/ProcedureNotFound.js';

import Request from '../models/Request.js';
import Response from '../models/Response.js';

import Gateway from './Gateway.js';
import Worker from './Worker.js';
import WorkerBalancer from './WorkerBalancer.js';

export default class LocalGateway extends Gateway
{
    #workers: Set<Worker> = new Set();
    #balancers: Map<string, WorkerBalancer> = new Map();
    #trustKey?: string;

    constructor(url?: string, trustKey?: string)
    {
        super(url);

        this.#trustKey = trustKey;
    }

    get workers()
    {
        return [...this.#workers.values()];
    }

    getProcedureNames(): string[]
    {
        const procedureNames = this.workers.map(worker => worker.getProcedureNames());
        const uniqueNames = new Set(procedureNames.flat());

        return [...uniqueNames.values()];
    }

    hasProcedure(fqn: string): boolean
    {
        const procedureNames = this.getProcedureNames();

        return procedureNames.includes(fqn);
    }

    async addWorker(worker: Worker, trustKey?: string): Promise<void>
    {
        if (trustKey !== undefined && this.#trustKey !== trustKey)
        {
            throw new InvalidTrustKey();
        }

        this.#workers.add(worker);

        for (const name of worker.getProcedureNames())
        {
            const balancer = this.#getOrCreateBalancer(name);

            balancer.addWorker(worker);
        }
    }

    removeWorker(worker: Worker): void
    {
        this.#workers.delete(worker);

        for (const name of worker.getProcedureNames())
        {
            const balancer = this.#getBalancer(name);

            if (balancer === undefined)
            {
                continue;
            }

            balancer.removeWorker(worker);
        }
    }

    #getBalancer(fqn: string): WorkerBalancer | undefined
    {
        return this.#balancers.get(fqn);
    }

    #getOrCreateBalancer(fqn: string): WorkerBalancer
    {
        let balancer = this.#getBalancer(fqn);

        if (balancer === undefined)
        {
            balancer = new WorkerBalancer();

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
