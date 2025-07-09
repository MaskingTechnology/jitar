
import { Response } from '@jitar/execution';
import type { Request } from '@jitar/execution';
import { HealthManager } from '@jitar/health';

import type { State } from '../common/definitions/States';
import type Worker from '../worker/Worker';

import Gateway from './Gateway';
import WorkerManager from './WorkerManager';
import WorkerMonitor from './WorkerMonitor';

import InvalidTrustKey from './errors/InvalidTrustKey';

type Configuration =
{
    url: string;
    trustKey?: string;
    monitorInterval?: number;
    healthManager: HealthManager;
};

export default class LocalGateway implements Gateway
{
    readonly #url: string;
    readonly #trustKey?: string;
    readonly #healthManager: HealthManager;
    readonly #workerManager: WorkerManager;
    readonly #workerMonitor: WorkerMonitor;

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#trustKey = configuration.trustKey;
        this.#healthManager = configuration.healthManager;
        this.#workerManager = new WorkerManager();
        this.#workerMonitor = new WorkerMonitor(this.#workerManager, configuration.monitorInterval);
    }
    
    get url() { return this.#url; }

    get trustKey() { return this.#trustKey; }

    async start(): Promise<void>
    {
        await Promise.all([
            this.#healthManager.start(),
            this.#workerMonitor.start()
        ]);
    }

    async stop(): Promise<void>
    {
        await Promise.all([
            this.#workerMonitor.start(),
            this.#healthManager.start()
        ]);
    }

    async isHealthy(): Promise<boolean>
    {
        return this.#healthManager.isHealthy();
    }

    async getHealth(): Promise<Map<string, boolean>>
    {
        return this.#healthManager.getHealth();
    }

    async addWorker(worker: Worker): Promise<string>
    {
        if (this.#isInvalidTrustKey(worker.trustKey))
        {
            throw new InvalidTrustKey();
        }

        return this.#workerManager.addWorker(worker);
    }

    getWorker(id: string): Worker
    {
        return this.#workerManager.getWorker(id);
    }

    async reportWorker(id: string, state: State): Promise<void>
    {
        return this.#workerManager.reportWorker(id, state);
    }

    async removeWorker(id: string): Promise<void>
    {
        return this.#workerManager.removeWorker(id);
    }

    getProcedureNames(): string[]
    {
        return this.#workerManager.getProcedureNames();
    }

    hasProcedure(name: string): boolean
    {
        return this.#workerManager.hasProcedure(name);
    }

    async run(request: Request): Promise<Response>
    {
        return this.#workerManager.run(request);
    }

    #isInvalidTrustKey(trustKey?: string): boolean
    {
        return this.#trustKey !== undefined && trustKey !== this.#trustKey;
    }
}
