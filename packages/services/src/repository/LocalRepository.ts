
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
    directoryIndex?: string;
    fallback?: string;
};

const DEFAULT_DIRECTORY_INDEX = 'index.html';

export default class LocalRepository implements Repository
{
    readonly #url: string;
    readonly #healthManager: HealthManager;
    readonly #sourcingManager: SourcingManager;
    readonly #assets: Set<string>;

    readonly #directoryIndex: string;
    readonly #fallback?: string;

    readonly #stateManager = new StateManager();

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#healthManager = configuration.healthManager;
        this.#sourcingManager = configuration.sourcingManager;
        this.#assets = configuration.assets;

        this.#directoryIndex = configuration.directoryIndex ?? DEFAULT_DIRECTORY_INDEX;
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

        const index = this.#resolveDirectoryIndex(filename);

        if (this.#assets.has(index))
        {
            return this.#sourcingManager.read(index);
        }

        if (this.#fallback !== undefined && this.#assets.has(this.#fallback))
        {
            return this.#sourcingManager.read(this.#fallback);
        }

        throw new FileNotFound(filename);
    }

    #resolveDirectoryIndex(directory: string)
    {
        if (directory === '' || directory === '/')
        {
            return this.#directoryIndex;
        }

        if (directory.endsWith('/'))
        {
            return `${directory}${this.#directoryIndex}`;
        }

        return `${directory}/${this.#directoryIndex}`;
    }
}
