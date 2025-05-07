
import type { SourcingManager } from '@jitar/sourcing';

export default class ResourceManager
{
    readonly #sourcingManager: SourcingManager;
    readonly #setUpScripts: string[];
    readonly #tearDownScripts: string[];

    constructor(sourcingManager: SourcingManager, setUpScripts: string[] = [], tearDownScripts: string[] = [])
    {
        this.#sourcingManager = sourcingManager;
        this.#setUpScripts = setUpScripts;
        this.#tearDownScripts = tearDownScripts;
    }

    async start(): Promise<void>
    {
        return this.#runSetupScripts();
    }

    async stop(): Promise<void>
    {
        return this.#runTearDownScripts();
    }

    #runSetupScripts(): Promise<void>
    {
        return this.#runScripts(this.#setUpScripts);
    }

    #runTearDownScripts(): Promise<void>
    {
        return this.#runScripts(this.#tearDownScripts);
    }

    async #runScripts(scripts: string[]): Promise<void>
    {
        await Promise.all(scripts.map(script => this.#sourcingManager.import(script)));
    }
}
