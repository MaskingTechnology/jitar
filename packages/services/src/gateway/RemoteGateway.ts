
import { NotImplemented } from '@jitar/errors';
import { Request, Response } from '@jitar/execution';

import Remote from '../Remote';
import Worker from '../worker/Worker';

import Gateway from './Gateway';

type Configuration =
{
    url: string;
};

export default class RemoteGateway implements Gateway
{
    #url: string;
    #remote: Remote;

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#remote = new Remote(configuration.url);
    }

    get url() { return this.#url; }
    
    start(): Promise<void>
    {
        return Promise.resolve();
    }

    stop(): Promise<void>
    {
        return Promise.resolve();
    }

    isHealthy(): Promise<boolean>
    {
        return this.#remote.isHealthy();
    }

    getHealth(): Promise<Map<string, boolean>>
    {
        return this.#remote.getHealth();
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

    addWorker(worker: Worker): Promise<void>
    {
        return this.#remote.addWorker(worker.url, worker.getProcedureNames(), worker.trustKey);
    }

    run(request: Request): Promise<Response>
    {
        return this.#remote.run(request);
    }
}
