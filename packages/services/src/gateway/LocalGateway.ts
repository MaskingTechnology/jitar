
import { Response } from '@jitar/execution';
import type { Request } from '@jitar/execution';
import { HealthManager } from '@jitar/health';

import Worker from '../worker/Worker';

import Gateway from './Gateway';
import WorkerManager from './WorkerManager';
import WorkerMonitor from './WorkerMonitor';

import InvalidTrustKey from './errors/InvalidTrustKey';

type Configuration =
{
    url: string;
    trustKey?: string;
    healthManager: HealthManager;
    monitorInterval?: number;
};

export default class LocalGateway implements Gateway
{
    #url: string;
    #trustKey?: string;
    #healthManager: HealthManager;
    #workerManager: WorkerManager;
    #workerMonitor: WorkerMonitor;

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
        return this.#workerMonitor.start();
    }

    async stop(): Promise<void>
    {
        return this.#workerMonitor.stop();
    }

    isHealthy(): Promise<boolean>
    {
        return this.#healthManager.isHealthy();
    }

    getHealth(): Promise<Map<string, boolean>>
    {
        return this.#healthManager.getHealth();
    }

    addWorker(worker: Worker, trustKey?: string): Promise<void>
    {
        if (this.#isInvalidTrustKey(trustKey))
        {
            throw new InvalidTrustKey();
        }

        return this.#workerManager.addWorker(worker);
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
