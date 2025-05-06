
import type { ExecutionManager, Request, Response } from '@jitar/execution';
import type { MiddlewareManager } from '@jitar/middleware';
import { LocalWorker, RemoteGateway, Remote } from '@jitar/services';

import ProcedureRunner from '../ProcedureRunner';
import Runtime from '../Runtime';

type Configuration =
{
    remoteUrl: string;
    remote: Remote;
    middlewareManager: MiddlewareManager;
    executionManager: ExecutionManager;
};

export default class Client extends Runtime
{
    readonly #worker: LocalWorker;
    readonly #middlewareManager: MiddlewareManager;

    constructor(configuration: Configuration)
    {
        super();

        this.#worker = new LocalWorker({
            url: configuration.remoteUrl,
            gateway: new RemoteGateway({
                url: configuration.remoteUrl,
                remote: configuration.remote
            }),
            executionManager: configuration.executionManager
        });

        this.#middlewareManager = configuration.middlewareManager;
    }

    get worker() { return this.#worker; }

    start(): Promise<void>
    {
        return this.#setUp();
    }

    stop(): Promise<void>
    {
        return this.#tearDown();
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
