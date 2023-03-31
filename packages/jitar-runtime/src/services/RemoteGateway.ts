
import NotImplemented from '../errors/generic/NotImplemented.js';
import Version from '../models/Version.js';

import Gateway from './Gateway.js';
import Node from './Node.js';
import Remote from './Remote.js';

export default class RemoteGateway extends Gateway
{
    #remote: Remote;

    constructor(url: string)
    {
        super(url);

        this.#remote = new Remote(url, true);
    }

    getProcedureNames(): string[]
    {
        throw new NotImplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasProcedure(name: string): boolean
    {
        throw new NotImplemented();
    }

    async addNode(node: Node): Promise<void>
    {
        return this.#remote.addNode(node);
    }

    async run(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>): Promise<unknown>
    {
        return this.#remote.run(fqn, version, args, headers);
    }
}
