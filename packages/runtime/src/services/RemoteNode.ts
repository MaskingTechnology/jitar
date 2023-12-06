
import Request from '../models/Request.js';
import Response from '../models/Response.js';

import Node from './Node.js';
import Remote from './Remote.js';

export default class RemoteNode extends Node
{
    #remote: Remote;
    #procedureNames: Set<string> = new Set();

    constructor(url: string, procedureNames: string[])
    {
        super(url);

        this.#remote = new Remote(url);

        this.registerProcedures(procedureNames);
    }

    getProcedureNames(): string[]
    {
        return [...this.#procedureNames.values()];
    }

    registerProcedures(procedureNames: string[]): void
    {
        procedureNames.forEach(procedureName => this.#procedureNames.add(procedureName));
    }

    hasProcedure(name: string): boolean
    {
        return this.#procedureNames.has(name);
    }

    isHealthy(): Promise<boolean>
    {
        return this.#remote.isHealthy();
    }

    getHealth(): Promise<Map<string, boolean>>
    {
        return this.#remote.getHealth();
    }

    run(request: Request): Promise<Response>
    {
        return this.#remote.run(request);
    }
}
