
import File from '../models/File.js';
import Request from '../models/Request.js';

import Repository from './Repository.js';
import ProcedureRuntime from './ProcedureRuntime.js';

export default class Proxy extends ProcedureRuntime
{
    #repository: Repository;
    #runner: ProcedureRuntime;

    constructor(repository: Repository, runner: ProcedureRuntime, url?: string)
    {
        super(url);

        this.#repository = repository;
        this.#runner = runner;
    }

    get repository() { return this.#repository; }

    get runner() { return this.#runner; }

    getProcedureNames(): string[] 
    {
        return this.#runner.getProcedureNames();
    }

    hasProcedure(fqn: string): boolean
    {
        const procedureNames = this.getProcedureNames();

        return procedureNames.includes(fqn);
    }

    loadAsset(filename: string): Promise<File>
    {
        return this.#repository.loadAsset(filename);
    }

    registerClient(segmentFiles: string[]): Promise<string>
    {
        return this.#repository.registerClient(segmentFiles);
    }

    loadModule(clientId: string, filename: string): Promise<File>
    {
        return this.#repository.loadModule(clientId, filename);
    }

    run(request: Request): Promise<unknown>
    {
        return this.#runner.run(request);
    }
}
