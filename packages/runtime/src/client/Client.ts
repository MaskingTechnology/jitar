
import type { ExecutionManager, Request, Response } from '@jitar/execution';
import type { HealthManager } from '@jitar/health';
import type { MiddlewareManager } from '@jitar/middleware';
import type { ScheduleManager } from '@jitar/scheduling';
import { LocalWorker, RemoteGateway, Remote, RequestPool } from '@jitar/services';

import StartingClientFailed from './errors/StartingClientFailed';
import StoppingClientFailed from './errors/StoppingClientFailed';

import ProcedureRunner from '../ProcedureRunner';
import Runtime from '../Runtime';

type Configuration =
{
    remoteUrl: string;
    remote: Remote;
    healthManager: HealthManager;
    middlewareManager: MiddlewareManager;
    executionManager: ExecutionManager;
    scheduleManager: ScheduleManager;
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
            executionManager: configuration.executionManager,
            scheduleManager: configuration.scheduleManager
        });

        this.#middlewareManager = configuration.middlewareManager;
    }

    get worker() { return this.#worker; }

    async start(): Promise<void>
    {
        try
        {
            await this.#setUp();

            this.#requestPool.start();
        }
        catch (error: unknown)
        {
            throw new StartingClientFailed(error);
        }
    }

    async stop(): Promise<void>
    {
        try
        {
            this.#requestPool.stop();

            await this.#tearDown();
        }
        catch (error: unknown)
        {
            throw new StoppingClientFailed(error);
        }
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
