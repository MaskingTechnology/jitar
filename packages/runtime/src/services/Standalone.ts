
import File from '../models/File.js';
import Request from '../models/Request.js';
import Response from '../models/Response.js';

import LocalNode from './LocalNode.js';
import LocalRepository from './LocalRepository.js';
import ProcedureRuntime from './ProcedureRuntime.js';

export default class Standalone extends ProcedureRuntime
{
    #node: LocalNode;

    constructor(repository: LocalRepository, node: LocalNode, url?: string)
    {
        super(repository, url);

        this.#node = node;
    }

    get node() { return this.#node; }

    async start(): Promise<void>
    {
        // The node will start the repository
        await this.#node.start();

        await super.start();
    }

    async stop(): Promise<void>
    {
        // The node will stop the repository
        await this.#node.stop();

        await super.stop();
    }

    getProcedureNames(): string[] 
    {
        return this.#node.getProcedureNames();
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

    registerClient(segmentFiles: string[]): Promise<string>
    {
        return this.repository.registerClient(segmentFiles);
    }

    readModule(filename: string, clientId: string): Promise<File>
    {
        return this.repository.readModule(filename, clientId);
    }

    run(request: Request): Promise<Response>
    {
        return this.#node.run(request);
    }
}
