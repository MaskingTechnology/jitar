
import { ProcedureNotFound, Request, Response, Runner } from '@jitar/execution';
import type { ScheduleManager, ScheduledTask } from '@jitar/scheduling';

import States from '../common/definitions/States';
import type { State } from '../common/definitions/States';
import Worker from '../worker/Worker';

import WorkerBalancer from './WorkerBalancer';
import IdGenerator from './utils/IdGenerator';
import UnknownWorker from './errors/UnknownWorker';

export default class WorkerManager implements Runner
{
    readonly #workers = new Map<string, Worker>();
    readonly #balancers = new Map<string, WorkerBalancer>();

    readonly #idGenerator = new IdGenerator();
    readonly #monitorTask: ScheduledTask;

    constructor(scheduleManager: ScheduleManager, monitorInterval?: number)
    {
        this.#monitorTask = scheduleManager.create(() => this.#monitor(), monitorInterval);
    }

    get workers()
    {
        return [...this.#workers.values()];
    }

    get balancers() { return this.#balancers; }

    start(): void
    {
        this.#monitorTask.start();
    }

    stop(): void
    {
        this.#monitorTask.stop();
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

    addWorker(worker: Worker): string
    {
        worker.id = this.#idGenerator.generate();

        this.#workers.set(worker.id, worker);

        for (const name of worker.getProcedureNames())
        {
            const balancer = this.#getOrCreateBalancer(name);

            balancer.addWorker(worker);
        }

        return worker.id;
    }

    getWorker(id: string)
    {
        const worker = this.#workers.get(id);

        if (worker === undefined)
        {
            throw new UnknownWorker(id);
        }

        return worker;
    }

    reportWorker(id: string, state: State): void
    {
        const worker = this.getWorker(id);

        worker.reportState(state);
    }

    removeWorker(id: string): Worker
    {
        const worker = this.getWorker(id);

        this.#workers.delete(id);

        for (const name of worker.getProcedureNames())
        {
            const balancer = this.#getBalancer(name);

            if (balancer === undefined)
            {
                continue;
            }

            balancer.removeWorker(worker);
        }

        return worker;
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

    async #monitor(): Promise<void>
    {
        const promises = this.workers.map(worker => this.#checkWorker(worker));

        await Promise.allSettled(promises);
    }

    async #checkWorker(worker: Worker): Promise<void>
    {
        const state = await worker.updateState();
        
        if (state === States.STOPPED)
        {
            this.removeWorker(worker.id as string);
        }
    }
}
