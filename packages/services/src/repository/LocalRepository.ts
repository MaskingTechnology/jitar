
import { File, FileNotFound, SourcingManager } from '@jitar/sourcing';

import Repository from './Repository.js';

type Configuration =
{
    url: string;
    assets: Set<string>;
    sourcingManager: SourcingManager;
};

export default class LocalRepository implements Repository
{
    #url: string;
    #sourcingManager: SourcingManager;
    #assets: Set<string>;

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#sourcingManager = configuration.sourcingManager;
        this.#assets = configuration.assets;
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

    async isHealthy(): Promise<boolean>
    {
        return true;
    }

    async getHealth(): Promise<Map<string, boolean>>
    {
        return new Map();
    }

    readAsset(filename: string): Promise<File>
    {
        if (this.#assets.has(filename) === false)
        {
            throw new FileNotFound(filename);
        }

        return this.#sourcingManager.read(filename);
    }
}
