
import Request from '../models/Request.js';
import Response from '../models/Response.js';

import DummyRepository from './DummyRepository.js';
import Node from './Node.js';
import Remote from './Remote.js';

export default class RemoteNode extends Node
{
    #remote: Remote;
    #procedureNames: Set<string> = new Set();

    constructor(url: string)
    {
        super(new DummyRepository(), url);

        this.#remote = new Remote(url);
    }

    get trustKey() { return undefined; }

    set procedureNames(names: Set<string>)
    {
        this.#procedureNames = names;
    }

    getProcedureNames(): string[]
    {
        return [...this.#procedureNames.values()];
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
