
import { NotImplemented } from '@jitar/errors';
import { Request, Response } from '@jitar/execution';

import type Remote from '../common/Remote';
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

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#remote = configuration.remote;
    }

    get url() { return this.#url; }

    get trustKey() { return undefined; }
    
    start(): Promise<void>
    {
        return this.#remote.connect();
    }

    stop(): Promise<void>
    {
        return this.#remote.disconnect();
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
