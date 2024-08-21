
import { File, FileNotFound, SourceManager } from '../../source';

import Repository from './Repository.js';

type Configuration =
{
    url: string;
    assets: Set<string>;
    sourceManager: SourceManager;
};

export default class LocalRepository implements Repository
{
    #url: string;
    #sourceManager: SourceManager;
    #assets: Set<string>;

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#sourceManager = configuration.sourceManager;
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

        return this.#readFile(filename);
    }

    async readModule(filename: string): Promise<File>
    {
        const file = await this.#readFile(filename);
        const code = file.content.toString();

        return new File(filename, 'application/javascript', code);
    }

    #readFile(filename: string): Promise<File>
    {
        return this.#sourceManager.read(filename);
    }
}
