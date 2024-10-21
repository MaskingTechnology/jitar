
import { Request, Response } from '@jitar/execution';

import Remote from '../Remote';

import Worker from './Worker';

type Configuration =
{
    url: string;
    trustKey?: string;
    procedureNames: Set<string>;
    remote: Remote;
};

export default class RemoteWorker implements Worker
{
    readonly #url: string;
    readonly #trustKey?: string;
    readonly #procedureNames: Set<string>;
    readonly #remote: Remote;

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#trustKey = configuration.trustKey;
        this.#procedureNames = configuration.procedureNames;
        this.#remote = configuration.remote;
    }
    
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

    run(request: Request): Promise<Response>
    {
        return this.#remote.run(request);
    }
}
