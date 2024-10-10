
import { ProcedureNotFound, Request, Response, Runner } from '@jitar/execution';

import Worker from '../worker/Worker';
import WorkerBalancer from './WorkerBalancer';

export default class WorkerManager implements Runner
{
    #workers = new Set<Worker>();
    #balancers = new Map<string, WorkerBalancer>();

    get workers()
    {
        return [...this.#workers.values()];
    }

    get balancers() { return this.#balancers; }

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

    async addWorker(worker: Worker): Promise<void>
    {
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

    async run(request: Request): Promise<Response>
    {
        const balancer = this.#getBalancer(request.fqn);

        if (balancer === undefined)
        {
            throw new ProcedureNotFound(request.fqn);
        }

        return balancer.run(request);
    }
}
