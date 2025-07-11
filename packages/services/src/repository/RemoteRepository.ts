
import { File } from '@jitar/sourcing';

import StateManager from '../common/StateManager';
import Remote from '../common/Remote';
import { State } from '../common/definitions/States';

import Repository from './Repository';

type Configuration =
{
    url: string;
    remote: Remote;
};

export default class RemoteRepository implements Repository
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

    provide(filename: string): Promise<File>
    {
        return this.#remote.provide(filename);
    }
}
