
import Version from '../core/Version.js';

import Node from './Node.js';
import Remote from './Remote.js';

export default class RemoteNode extends Node
{
    #remote: Remote;
    #procedureNames: Set<string> = new Set();

    constructor(url: string, procedureNames: string[])
    {
        super(url);

        this.#remote = new Remote(url, false);
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

    async isHealthy(): Promise<boolean>
    {
        return this.#remote.isHealthy();
    }

    async getHealth(): Promise<Map<string, boolean>>
    {
        return this.#remote.getHealth();
    }

    async run(fqn: string, version: Version, args: Map<string, unknown>): Promise<unknown>
    {
        return this.#remote.run(fqn, version, args);
    }
}
