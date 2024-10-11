
import { File, FileNotFound, SourcingManager } from '@jitar/sourcing';

import Repository from './Repository';

type Configuration =
{
    url: string;
    assets: Set<string>;
    sourcingManager: SourcingManager;
    indexFilename?: string;
    serveIndexOnNotFound?: boolean;
};

const DEFAULT_INDEX_FILENAME = 'index.html';
const DEFAULT_SERVE_INDEX_ON_NOT_FOUND = false;

export default class LocalRepository implements Repository
{
    readonly #url: string;
    readonly #sourcingManager: SourcingManager;
    readonly #assets: Set<string>;

    readonly #indexFilename: string;
    readonly #serveIndexOnNotFound: boolean;

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#sourcingManager = configuration.sourcingManager;
        this.#assets = configuration.assets;

        this.#indexFilename = configuration.indexFilename ?? DEFAULT_INDEX_FILENAME;
        this.#serveIndexOnNotFound = configuration.serveIndexOnNotFound ?? DEFAULT_SERVE_INDEX_ON_NOT_FOUND;
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

    async provide(filename: string): Promise<File>
    {
        if (this.#mustProvideIndex(filename))
        {
            return this.provide(this.#indexFilename);
        }

        if (this.#assets.has(filename) === false)
        {
            throw new FileNotFound(filename);
        }

        return this.#sourcingManager.read(filename);
    }

    #mustProvideIndex(filename: string): boolean
    {
        if (filename === '')
        {
            return true;
        }

        if (filename === this.#indexFilename)
        {
            return false;
        }

        return this.#serveIndexOnNotFound
            && this.#assets.has(filename) === false;
    }
}
