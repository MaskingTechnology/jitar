
import { Request, Response } from '@jitar/execution';

import Remote from '../Remote';

import Worker from './Worker';

type Configuration =
{
    url: string;
    procedureNames: Set<string>;
    remote: Remote;
};

export default class RemoteWorker implements Worker
{
    #url: string;
    #procedureNames: Set<string>;
    #remote: Remote;

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#procedureNames = configuration.procedureNames;
        this.#remote = configuration.remote;
    }
    
    get url() { return this.#url; }

    get trustKey() { return undefined; }

    start(): Promise<void>
    {
        return Promise.resolve();
    }
    
    stop(): Promise<void>
    {
        return Promise.resolve();
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
