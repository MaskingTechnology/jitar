
import { Response } from '@jitar/execution';
import type { Request } from '@jitar/execution';

import Worker from '../worker/Worker';

import Gateway from './Gateway';
import WorkerManager from './WorkerManager';
import WorkerMonitor from './WorkerMonitor';

import InvalidTrustKey from './errors/InvalidTrustKey';

type Configuration =
{
    url: string;
    trustKey?: string;
    monitorInterval?: number;
};

export default class LocalGateway implements Gateway
{
    readonly #url: string;
    readonly #trustKey?: string;
    readonly #workerManager: WorkerManager;
    readonly #workerMonitor: WorkerMonitor;

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#trustKey = configuration.trustKey;
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

    async isHealthy(): Promise<boolean>
    {
        return true;
    }

    async getHealth(): Promise<Map<string, boolean>>
    {
        return new Map();
    }

    async addWorker(worker: Worker, trustKey?: string): Promise<void>
    {
        if (this.#isInvalidTrustKey(trustKey))
        {
            throw new InvalidTrustKey();
        }

        return this.#workerManager.addWorker(worker);
    }

    async removeWorker(worker: Worker, trustKey?: string): Promise<void>
    {
        if (this.#isInvalidTrustKey(trustKey))
        {
            throw new InvalidTrustKey();
        }
        
        return this.#workerManager.removeWorker(worker);
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
