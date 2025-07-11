
import { NotImplemented } from '@jitar/errors';
import { Request, Response } from '@jitar/execution';

import type Remote from '../common/Remote';
import StateManager from '../common/StateManager';
import type { State } from '../common/definitions/States';
import type Worker from '../worker/Worker';

import Gateway from './Gateway';

type Configuration =
{
    url: string;
    remote: Remote;
};

export default class RemoteGateway implements Gateway
{
    readonly #url: string;
    readonly #remote: Remote;

    readonly #stateManager = new StateManager();

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#remote = configuration.remote;
    }

    get url() { return this.#url; }

    get state() { return this.#stateManager.state; }

    get trustKey() { return undefined; }
    
    async start(): Promise<void>
    {
        if (this.#stateManager.isNotStopped())
        {
            return;
        }

        this.#stateManager.setStarting();

        await this.#remote.connect();

        await this.updateState();
    }

    async stop(): Promise<void>
    {
        if (this.#stateManager.isNotStarted())
        {
            return;
        }

        this.#stateManager.setStopping();

        await this.#remote.disconnect();

        this.#stateManager.setStopped();
    }

    isHealthy(): Promise<boolean>
    {
        return this.#remote.isHealthy();
    }

    getHealth(): Promise<Map<string, boolean>>
    {
        return this.#remote.getHealth();
    }

    async updateState(): Promise<State>
    {
        const healthy = await this.isHealthy();

        return this.#stateManager.setAvailability(healthy);
    }

    getProcedureNames(): string[]
    {
        throw new NotImplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasProcedure(name: string): boolean
    {
        throw new NotImplemented();
    }

    addWorker(worker: Worker): Promise<string>
    {
        return this.#remote.addWorker(worker.url, worker.getProcedureNames(), worker.trustKey);
    }

    reportWorker(id: string, state: State): Promise<void>
    {
        return this.#remote.reportWorker(id, state);
    }

    removeWorker(id: string): Promise<void>
    {
        return this.#remote.removeWorker(id);
    }

    run(request: Request): Promise<Response>
    {
        return this.#remote.run(request);
    }
}
