
import type { ExecutionManager, Request, Response } from '@jitar/execution';
import type { HealthManager } from '@jitar/health';
import type { MiddlewareManager } from '@jitar/middleware';
import { LocalWorker, RemoteGateway } from '@jitar/services';

import ProcedureRunner from '../ProcedureRunner';
import Runtime from '../Runtime';

type Configuration =
{
    remoteUrl: string;
    healthManager: HealthManager; // object with all health checks loaded
    middlewareManager: MiddlewareManager; // object with all middleware loaded
    executionManager: ExecutionManager; // object with all segments loaded
};

export default class Client extends Runtime
{
    #worker: LocalWorker;
    #middlewareManager: MiddlewareManager;

    constructor(configuration: Configuration)
    {
        super();

        this.#worker = new LocalWorker({
            url: configuration.remoteUrl,
            gateway: new RemoteGateway({ url: configuration.remoteUrl }),
            healthManager: configuration.healthManager,
            executionManager: configuration.executionManager
        });

        this.#middlewareManager = configuration.middlewareManager;

        const procedureRunner = new ProcedureRunner(this.#worker);
        this.#middlewareManager.addMiddleware(procedureRunner);
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

    getTrustKey(): string | undefined
    {
        return undefined;
    }

    run(request: Request): Promise<Response>
    {
        return this.runInternal(request);
    }

    runInternal(request: Request): Promise<Response>
    {
        return this.#middlewareManager.handle(request);
    }
}
