
import { Request, Response } from '../../execution';
import { File } from '../../source';

import Gateway from '../gateway/Gateway';
import Worker from '../worker/Worker';
import RemoteRepository from '../repository/RemoteRepository';

import RunnerService from '../RunnerService';

type Runner = Gateway | Worker;

type Configuration =
{
    url: string;
    repository: RemoteRepository;
    runner: Runner;
};

export default class Proxy implements RunnerService
{
    #url: string;
    #repository: RemoteRepository;
    #runner: Runner;

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

    readModule(specifier: string): Promise<File>
    {
        return this.#repository.readModule(specifier);
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
