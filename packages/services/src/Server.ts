
import type { Request, Response, Runner } from '@jitar/execution';
import type { SourcingManager } from '@jitar/sourcing';

import Service from './Service';
import RunnerService from './RunnerService';

type Configuration =
{
    service: Service;
    sourcingManager: SourcingManager;
    setUpScripts?: string[];
    tearDownScripts?: string[];
};

export default class Server implements Runner
{
    #service: Service;
    #sourcingManager: SourcingManager;
    #setUpScripts: string[];
    #tearDownScripts: string[];

    constructor(configuration: Configuration)
    {
        this.#service = configuration.service;
        this.#sourcingManager = configuration.sourcingManager;
        this.#setUpScripts = configuration.setUpScripts ?? [];
        this.#tearDownScripts = configuration.tearDownScripts ?? [];
    }

    get service() { return this.#service; }

    async start(): Promise<void>
    {
        await this.#setUp();

        return this.#service.start();
    }

    async stop(): Promise<void>
    {
        await this.#service.stop();;

        return this.#tearDown();
    }

    run(request: Request): Promise<Response>
    {
        if (this.#canNotRun())
        {
            throw new Error('Cannot run');
        }

        return (this.#service as RunnerService).run(request);
    }

    #canNotRun(): boolean
    {
        return (this.#service as RunnerService).run === undefined;
    }

    #setUp(): Promise<void>
    {
        return this.#runScripts(this.#setUpScripts);
    }

    #tearDown(): Promise<void>
    {
        return this.#runScripts(this.#tearDownScripts);
    }

    async #runScripts(scripts: string[]): Promise<void>
    {
        await Promise.all(scripts.map(script => this.#sourcingManager.import(script)));
    }
}
