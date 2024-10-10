
import type { Request, Response } from '@jitar/execution';
import type { File } from '@jitar/sourcing';

import RunnerService from '../RunnerService';
import ProviderService from '../ProviderService';

type Configuration =
{
    url: string;
    provider: ProviderService;
    runner: RunnerService;
};

export default class Proxy implements ProviderService, RunnerService
{
    readonly #url: string;
    readonly #provider: ProviderService;
    readonly #runner: RunnerService;

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#provider = configuration.provider;
        this.#runner = configuration.runner;
    }

    get url() { return this.#url; }

    get trustKey() { return this.#runner.trustKey; }

    get provider() { return this.#provider; }

    get runner() { return this.#runner; }

    async isHealthy(): Promise<boolean>
    {
        const [providerHealthy, runnerHealthy] = await Promise.all([
            this.#provider.isHealthy(),
            this.#runner.isHealthy()
        ]);

        return providerHealthy && runnerHealthy;
    }

    async getHealth(): Promise<Map<string, boolean>>
    {
        const [providerHealth, runnerHealth] = await Promise.all([
            this.#provider.getHealth(),
            this.#runner.getHealth()
        ]);

        return new Map([...providerHealth, ...runnerHealth]);
    }

    async start(): Promise<void>
    {
        await Promise.all([
            this.#provider.start(),
            this.#runner.start()
        ]);
    }

    async stop(): Promise<void>
    {
        await Promise.all([
            this.#runner.stop(),
            this.#provider.stop()
        ]);
    }

    provide(filename: string): Promise<File>
    {
        return this.#provider.provide(filename);
    }

    getProcedureNames(): string[] 
    {
        return this.#runner.getProcedureNames();
    }

    hasProcedure(fqn: string): boolean
    {
        return this.#runner.hasProcedure(fqn);
    }

    run(request: Request): Promise<Response>
    {
        return this.#runner.run(request);
    }
}
