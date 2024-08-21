
import type { Request, Response } from '../../execution';
import { HealthManager } from '../../health';
import { MiddlewareManager, ProcedureRunner } from '../../middleware';

import Worker from '../worker/Worker';

import Gateway from './Gateway';
import WorkerManager from './WorkerManager';
import WorkerMonitor from './WorkerMonitor';

import InvalidTrustKey from './errors/InvalidTrustKey';

type Configuration =
{
    url: string;
    trustKey?: string;
    healthManager: HealthManager; // object with all health checks loaded
    middlewareManager: MiddlewareManager; // object with all middleware loaded
    monitorInterval?: number;
};

export default class LocalGateway implements Gateway
{
    #url: string;
    #trustKey?: string;
    #healthManager: HealthManager;
    #middlewareManager: MiddlewareManager;
    #workerManager: WorkerManager;
    #workerMonitor: WorkerMonitor;

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#trustKey = configuration.trustKey;
        this.#healthManager = configuration.healthManager;
        this.#middlewareManager = configuration.middlewareManager;
        this.#workerManager = new WorkerManager();
        this.#workerMonitor = new WorkerMonitor(this.#workerManager, configuration.monitorInterval);

        // TODO: Should be done when constructing the middleware manager
        this.#middlewareManager.addMiddleware(new ProcedureRunner(this.#workerManager));
    }
    
    get url() { return this.#url; }

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

    run(request: Request): Promise<Response>
    {
        return this.#middlewareManager.handle(request);
    }

    #isInvalidTrustKey(trustKey?: string): boolean
    {
        return this.#trustKey !== undefined && trustKey !== this.#trustKey;
    }
}
