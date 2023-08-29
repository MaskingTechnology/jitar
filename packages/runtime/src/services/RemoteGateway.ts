
import NotImplemented from '../errors/generic/NotImplemented.js';

import Request from '../models/Request.js';
import Response from '../models/Response.js';

import Gateway from './Gateway.js';
import Node from './Node.js';
import Remote from './Remote.js';

export default class RemoteGateway extends Gateway
{
    #remote: Remote;

    constructor(url: string)
    {
        super(url);

        this.#remote = new Remote(url);
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

    addNode(node: Node): Promise<void>
    {
        return this.#remote.addNode(node);
    }

    run(request: Request): Promise<Response>
    {
        return this.#remote.run(request);
    }
}
