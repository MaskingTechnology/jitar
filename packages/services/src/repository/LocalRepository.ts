
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
    spaFallback?: boolean;
};

const DEFAULT_INDEX_FILENAME = 'index.html';
const DEFAULT_SPA_FALLBACK = false;

export default class LocalRepository implements Repository
{
    readonly #url: string;
    readonly #healthManager: HealthManager;
    readonly #sourcingManager: SourcingManager;
    readonly #assets: Set<string>;

    readonly #indexFilename: string;
    readonly #spaFallback: boolean;

    readonly #stateManager = new StateManager();

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#healthManager = configuration.healthManager;
        this.#sourcingManager = configuration.sourcingManager;
        this.#assets = configuration.assets;

        this.#indexFilename = configuration.indexFilename ?? DEFAULT_INDEX_FILENAME;
        this.#spaFallback = configuration.spaFallback ?? DEFAULT_SPA_FALLBACK;
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

        // SPA config always returns the fallback
        if (this.#spaFallback)
        {
            return this.#sourcingManager.read(this.#indexFilename);
        }

        // Static config checks for directory index
        const indexFilename = filename.endsWith('/')
            ? `${filename}${this.#indexFilename}`
            : `${filename}/${this.#indexFilename}`;

        if (this.#assets.has(indexFilename))
        {
            return this.#sourcingManager.read(indexFilename);
        }

        throw new FileNotFound(filename);
    }
}
