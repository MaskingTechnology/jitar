
import { Request, Response } from '@jitar/execution';

import Remote from '../common/Remote';
import ReportedStateManager from '../common/ReportedStateManager';
import type { State } from '../common/definitions/States';

import Worker from './Worker';

type Configuration =
{
    url: string;
    trustKey?: string;
    procedureNames: Set<string>;
    remote: Remote;
    unavailableThreshold?: number;
    stoppedThreshold?: number;
};

export default class RemoteWorker implements Worker
{
    #id?: string;

    readonly #url: string;
    readonly #trustKey?: string;
    readonly #procedureNames: Set<string>;
    readonly #remote: Remote;
    readonly #stateManager: ReportedStateManager;

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#trustKey = configuration.trustKey;
        this.#procedureNames = configuration.procedureNames;
        this.#remote = configuration.remote;
        this.#stateManager = new ReportedStateManager(configuration.unavailableThreshold, configuration.stoppedThreshold);
    }

    get id(): string | undefined { return this.#id; }

    set id(id: string) { this.#id = id; }

    get state() { return this.#stateManager.state; }

    get url() { return this.#url; }

    get trustKey() { return this.#trustKey; }

    async start(): Promise<void>
    {
        return this.#stateManager.start(async () =>
        {
            await this.#remote.connect();

            await this.updateState();
        });
    }

    async stop(): Promise<void>
    {
        return this.#stateManager.stop(async () =>
        {
            await this.#remote.disconnect();
        });
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

    isAvailable(): boolean
    {
        return this.#stateManager.isAvailable();
    }

    async updateState(): Promise<State>
    {
        return this.#stateManager.update();
    }

    async reportState(state: State): Promise<void>
    {
        this.#stateManager.report(state);
    }

    run(request: Request): Promise<Response>
    {
        return this.#remote.run(request);
    }
}
