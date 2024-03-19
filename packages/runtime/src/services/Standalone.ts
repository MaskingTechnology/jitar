
import File from '../models/File.js';
import Request from '../models/Request.js';
import Response from '../models/Response.js';

import LocalWorker from './LocalWorker.js';
import LocalRepository from './LocalRepository.js';
import ProcedureRuntime from './ProcedureRuntime.js';

export default class Standalone extends ProcedureRuntime
{
    #worker: LocalWorker;

    constructor(repository: LocalRepository, worker: LocalWorker, url?: string)
    {
        super(repository, url);

        this.#worker = worker;
    }

    get worker() { return this.#worker; }

    async start(): Promise<void>
    {
        // The worker will start the repository
        await this.#worker.start();

        await super.start();
    }

    async stop(): Promise<void>
    {
        // The worker will stop the repository
        await this.#worker.stop();

        await super.stop();
    }

    getProcedureNames(): string[] 
    {
        return this.#worker.getProcedureNames();
    }

    hasProcedure(fqn: string): boolean
    {
        const procedureNames = this.getProcedureNames();

        return procedureNames.includes(fqn);
    }

    readAsset(filename: string): Promise<File>
    {
        return this.repository.readAsset(filename);
    }

    readModule(source: string, specifier: string): Promise<File>
    {
        return this.repository.readModule(source, specifier);
    }

    run(request: Request): Promise<Response>
    {
        return this.#worker.run(request);
    }
}
