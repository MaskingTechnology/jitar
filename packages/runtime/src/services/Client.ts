
import { Request, Response, ExecutionManager, Runner } from '../execution';
import { MiddlewareManager, ProcedureRunner } from '../middleware';

import { setRuntime } from '../hooks.js';

import RemoteGateway from './gateway/RemoteGateway';

type Configuration =
{
    gateway: RemoteGateway;
    middlewareManager: MiddlewareManager; // object with all middleware loaded
    executionManager: ExecutionManager; // object with all segments loaded
};

export default class Client implements Runner
{
    #gateway: RemoteGateway;

    #middlewareManager: MiddlewareManager;
    #executionManager: ExecutionManager;

    constructor(configuration: Configuration)
    {
        this.#gateway = configuration.gateway;

        this.#middlewareManager = configuration.middlewareManager;
        this.#executionManager = configuration.executionManager;

        // TODO: Should be done when constructing the middleware manager
        this.#middlewareManager.addMiddleware(new ProcedureRunner(this.#executionManager));

        setRuntime(this);
    }

    run(request: Request): Promise<Response>
    {
        return this.#mustRunLocal(request)
            ? this.#runLocal(request)
            : this.#runRemote(request);
    }

    #mustRunLocal(request: Request): boolean
    {
        return this.#executionManager.hasProcedure(request.fqn);
    }

    #runLocal(request: Request): Promise<Response>
    {
        return this.#middlewareManager.handle(request);
    }

    #runRemote(request: Request): Promise<Response>
    {
        return this.#gateway.run(request);
    }
}
