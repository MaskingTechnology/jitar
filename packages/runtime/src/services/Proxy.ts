
import File from '../models/File.js';
import Request from '../models/Request.js';
import Response from '../models/Response.js';
import Import from '../models/Import.js';

import RemoteGateway from './RemoteGateway.js';
import RemoteWorker from './RemoteWorker.js';
import RemoteRepository from './RemoteRepository.js';
import ProcedureRuntime from './ProcedureRuntime.js';

export default class Proxy extends ProcedureRuntime
{
    #runner: RemoteGateway | RemoteWorker;

    constructor(repository: RemoteRepository, runner: RemoteGateway | RemoteWorker, url?: string)
    {
        super(repository, url);

        this.#runner = runner;
    }

    get runner() { return this.#runner; }

    async start(): Promise<void>
    {
        await super.start();

        await this.#runner.start();
    }

    async stop(): Promise<void>
    {
        await this.#runner.stop();

        await super.stop();
    }

    getProcedureNames(): string[] 
    {
        return this.#runner.getProcedureNames();
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

    readModule(importModel: Import): Promise<File>
    {
        return this.repository.readModule(importModel);
    }

    run(request: Request): Promise<Response>
    {
        return this.#runner.run(request);
    }
}
