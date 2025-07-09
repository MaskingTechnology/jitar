
import { Request, Response } from '@jitar/execution';

import Remote from '../common/Remote';
import StateManager from '../common/StateManager';
import type { State } from '../common/definitions/States';

import Worker from './Worker';

type Configuration =
{
    url: string;
    trustKey?: string;
    procedureNames: Set<string>;
    remote: Remote;
    unavailableThreshold?: number,
    disconnectedThreshold?: number
};

export default class RemoteWorker implements Worker
{
    #id?: string;

    readonly #url: string;
    readonly #trustKey?: string;
    readonly #procedureNames: Set<string>;
    readonly #remote: Remote;

    readonly #stateManager: StateManager;

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#trustKey = configuration.trustKey;
        this.#procedureNames = configuration.procedureNames;
        this.#remote = configuration.remote;
        this.#stateManager = new StateManager(configuration.unavailableThreshold, configuration.disconnectedThreshold);
    }

    get id(): string | undefined { return this.#id; }

    set id(id: string) { this.#id = id; }

    get state() { return this.#stateManager.state; }

    set state(state: State) { this.#stateManager.setState(state);}

    get url() { return this.#url; }

    get trustKey() { return this.#trustKey; }

    start(): Promise<void>
    {
        return this.#remote.connect();
    }
    
    stop(): Promise<void>
    {
        return this.#remote.disconnect();
    }

    getProcedureNames(): string[]
    {
        return [...this.#procedureNames.values()];
    }

    hasProcedure(name: string): boolean
    {
        return this.#procedureNames.has(name);
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
        return this.#stateManager.update();
    }

    run(request: Request): Promise<Response>
    {
        return this.#remote.run(request);
    }
}
