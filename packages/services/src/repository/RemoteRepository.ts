
import { File } from '@jitar/sourcing';

import Remote from '../Remote';

import Repository from './Repository';

type Configuration =
{
    url: string;
    remote: Remote;
};

export default class RemoteRepository implements Repository
{
    #url: string
    #remote: Remote;
    
    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#remote = configuration.remote;
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

    provide(filename: string): Promise<File>
    {
        return this.#remote.loadFile(filename);
    }
}
