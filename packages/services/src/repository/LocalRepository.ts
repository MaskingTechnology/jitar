
import { HealthManager } from '@jitar/health';
import { File, FileNotFound, SourcingManager } from '@jitar/sourcing';

import Repository from './Repository';

import StateManager from '../common/StateManager';
import { State } from '../common/definitions/States';

type Configuration =
{
    url: string;
    assets: Set<string>;
    healthManager: HealthManager;
    sourcingManager: SourcingManager;
    indexFilename?: string;
    fallback?: string;
};

const DEFAULT_INDEX_FILENAME = 'index.html';

export default class LocalRepository implements Repository
{
    readonly #url: string;
    readonly #healthManager: HealthManager;
    readonly #sourcingManager: SourcingManager;
    readonly #assets: Set<string>;

    readonly #indexFilename: string;
    readonly #fallback?: string;

    readonly #stateManager = new StateManager();

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#healthManager = configuration.healthManager;
        this.#sourcingManager = configuration.sourcingManager;
        this.#assets = configuration.assets;

        this.#indexFilename = configuration.indexFilename ?? DEFAULT_INDEX_FILENAME;
        this.#fallback = configuration.fallback;
    }

    get url() { return this.#url; }

    get state() { return this.#stateManager.state; }

    async start(): Promise<void>
    {
        return this.#stateManager.start(async () =>
        {
            await this.#healthManager.start();

            await this.updateState();
        });
    }

    async stop(): Promise<void>
    {
        return this.#stateManager.stop(async () =>
        {
            await this.#healthManager.stop();
        });
    }

    isHealthy(): Promise<boolean>
    {
        return this.#healthManager.isHealthy();
    }

    getHealth(): Promise<Map<string, boolean>>
    {
        return this.#healthManager.getHealth();
    }

    async updateState(): Promise<State>
    {
        const healthy = await this.isHealthy();

        return this.#stateManager.setAvailability(healthy);
    }

    async provide(filename: string): Promise<File>
    {
        if (this.#assets.has(filename))
        {
            return this.#sourcingManager.read(filename);
        }

        const indexFilename = filename.endsWith('/')
            ? `${filename}${this.#indexFilename}`
            : `${filename}/${this.#indexFilename}`;

        if (this.#assets.has(indexFilename))
        {
            return this.#sourcingManager.read(indexFilename);
        }


        if (this.#fallback !== undefined && this.#assets.has(this.#fallback))
        {
            return this.#sourcingManager.read(this.#fallback);
        }

        throw new FileNotFound(filename);
    }
}
