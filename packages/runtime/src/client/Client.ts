
import type { ExecutionManager, Request, Response } from '@jitar/execution';
import { HealthManager } from '@jitar/health';
import type { MiddlewareManager } from '@jitar/middleware';
import { LocalWorker, RemoteGateway, Remote, RequestPool } from '@jitar/services';

import ProcedureRunner from '../ProcedureRunner';
import Runtime from '../Runtime';

type Configuration =
{
    remoteUrl: string;
    remote: Remote;
    healthManager: HealthManager;
    middlewareManager: MiddlewareManager;
    executionManager: ExecutionManager;
};

export default class Client extends Runtime
{
    readonly #worker: LocalWorker;
    readonly #middlewareManager: MiddlewareManager;

    readonly #requestPool = new RequestPool(this);

    constructor(configuration: Configuration)
    {
        super();

        this.#worker = new LocalWorker({
            url: configuration.remoteUrl,
            gateway: new RemoteGateway({
                url: configuration.remoteUrl,
                remote: configuration.remote
            }),
            healthManager: configuration.healthManager,
            executionManager: configuration.executionManager
        });

        this.#middlewareManager = configuration.middlewareManager;
    }

    get worker() { return this.#worker; }

    async start(): Promise<void>
    {
        await this.#setUp();

        this.#requestPool.start();
    }

    async stop(): Promise<void>
    {
        this.#requestPool.stop();

        await this.#tearDown();
    }

    getTrustKey(): string | undefined
    {
        return undefined;
    }

    run(request: Request): Promise<Response>
    {
        return this.#middlewareManager.handle(request);
    }

    async runInternal(request: Request): Promise<Response>
    {
        return this.#requestPool.run(request);
    }

    async #setUp(): Promise<void>
    {
        await Promise.all(
        [
            this.#worker.start(),
            this.#middlewareManager.start()
        ]);

        const procedureRunner = new ProcedureRunner(this.#worker);
        this.#middlewareManager.addMiddleware(procedureRunner);
    }

    async #tearDown(): Promise<void>
    {
        await Promise.all(
        [
            this.#middlewareManager.stop(),
            this.#worker.stop()
        ]);
    }
}
