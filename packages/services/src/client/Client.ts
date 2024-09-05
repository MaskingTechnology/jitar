
import type { ExecutionManager, Request, Response } from '@jitar/execution';
import type { HealthManager } from '@jitar/health';
import type { MiddlewareManager } from '@jitar/middleware';

import LocalWorker from '../worker/LocalWorker';
import RemoteGateway from '../gateway/RemoteGateway';

type Configuration =
{
    remoteUrl: string;
    healthManager: HealthManager; // object with all health checks loaded
    middlewareManager: MiddlewareManager; // object with all middleware loaded
    executionManager: ExecutionManager; // object with all segments loaded
};

export default class Client
{
    #worker: LocalWorker;

    constructor(configuration: Configuration)
    {
        this.#worker = new LocalWorker({
            url: configuration.remoteUrl,
            gateway: new RemoteGateway({ url: configuration.remoteUrl }),
            healthManager: configuration.healthManager,
            middlewareManager: configuration.middlewareManager,
            executionManager: configuration.executionManager
        });
    }

    get worker() { return this.#worker; }

    start(): Promise<void>
    {
        return this.#worker.start();
    }

    stop(): Promise<void>
    {
        return this.#worker.stop();
    }

    run(request: Request): Promise<Response>
    {
        return this.#worker.run(request);
    }
}
