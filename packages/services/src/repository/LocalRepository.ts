
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

    #indexFilename?: string;
    #serviceIndexOnNotFound: boolean;

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#sourcingManager = configuration.sourcingManager;
        this.#assets = configuration.assets;

        // TODO: make these configurable
        this.#indexFilename = 'index.html';
        this.#serviceIndexOnNotFound = false;
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

    provide(filename: string): Promise<File>
    {
        if (this.#assets.has(filename) === false)
        {
            if (this.#mustProvideIndex())
            {
                return this.provide(this.#indexFilename!);
            }

            throw new FileNotFound(filename);
        }

        return this.#sourcingManager.read(filename);
    }

    #mustProvideIndex(): boolean
    {
        return this.#indexFilename !== undefined && this.#serviceIndexOnNotFound;
    }
}
