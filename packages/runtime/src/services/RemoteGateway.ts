
import NotImplemented from '../errors/generic/NotImplemented.js';

import Request from '../models/Request.js';
import Response from '../models/Response.js';

import Gateway from './Gateway.js';
import Worker from './Worker.js';
import Remote from './Remote.js';

export default class RemoteGateway extends Gateway
{
    #remote: Remote;
    #worker?: Worker;

    constructor(url: string)
    {
        super(url);

        this.#remote = new Remote(url);
    }

    get worker() { return this.#worker; }

    set worker(worker: Worker | undefined) { this.#worker = worker; }

    async start(): Promise<void>
    {
        await super.start();
        
        if (this.#worker !== undefined)
        {
            await this.addWorker(this.#worker);
        }
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

    addWorker(worker: Worker): Promise<void>
    {
        return this.#remote.addWorker(worker);
    }

    run(request: Request): Promise<Response>
    {
        return this.#remote.run(request);
    }
}
