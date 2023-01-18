
import Version from '../core/Version.js';

import ProcedureContainer from './interfaces/ProcedureContainer.js';

import Gateway from './Gateway.js';
import File from './models/File.js';
import Node from './Node.js';
import Repository from './Repository.js';
import Runtime from './Runtime.js';
import ProcedureRunner from './ProcedureRunner.js';

export default class Proxy extends Runtime implements ProcedureContainer
{
    #repository: Repository;
    #runner: Gateway | Node;

    constructor(repository: Repository, runner: Gateway | Node, url?: string)
    {
        super(url);

        this.#repository = repository;
        this.#runner = runner;

        this.addMiddleware(new ProcedureRunner(this));
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

    async loadAsset(filename: string): Promise<File>
    {
        return this.#repository.loadAsset(filename);
    }

    async registerClient(segmentFiles: string[]): Promise<string>
    {
        return this.#repository.registerClient(segmentFiles);
    }

    async loadModule(clientId: string, filename: string): Promise<File>
    {
        return this.#repository.loadModule(clientId, filename);
    }

    async run(name: string, version: Version, args: Map<string, unknown>): Promise<unknown>
    {
        return this.#runner.run(name, version, args);
    }
}
