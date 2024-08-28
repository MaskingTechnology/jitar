
import type { Request, Response } from '@jitar/execution';
import type { File } from '@jitar/sourcing';

import Repository from '../repository/Repository';

import RunnerService from '../RunnerService';

type Configuration =
{
    url: string;
    repository: Repository;
    runner: RunnerService;
};

export default class Proxy implements Repository, RunnerService
{
    #url: string;
    #repository: Repository;
    #runner: RunnerService;

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#repository = configuration.repository;
        this.#runner = configuration.runner;
    }

    get url() { return this.#url; }

    isHealthy(): Promise<boolean>
    {
        throw new Error('Method not implemented.');
    }

    getHealth(): Promise<Map<string, boolean>>
    {
        throw new Error('Method not implemented.');
    }

    get repository() { return this.#repository; }

    get runner() { return this.#runner; }

    async start(): Promise<void>
    {
        await Promise.all([
            this.#repository.start(),
            this.#runner.start()
        ]);
    }

    async stop(): Promise<void>
    {
        await Promise.all([
            this.#runner.stop(),
            this.#repository.stop()
        ]);
    }

    readAsset(filename: string): Promise<File>
    {
        return this.#repository.readAsset(filename);
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
