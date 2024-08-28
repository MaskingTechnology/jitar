
import { Request, Response, ExecutionManager } from '@jitar/execution';
import { Unauthorized } from '@jitar/errors';
import { HealthManager } from '@jitar/health';
import { MiddlewareManager, ProcedureRunner } from '@jitar/middleware';

import Gateway from '../gateway/Gateway';
import Worker from './Worker';

import InvalidTrustKey from './errors/InvalidTrustKey';

const JITAR_TRUST_HEADER_KEY = 'X-Jitar-Trust-Key';

type Configuration =
{
    url: string;
    trustKey?: string;
    gateway?: Gateway;
    healthManager: HealthManager; // object with all health checks loaded
    middlewareManager: MiddlewareManager; // object with all middleware loaded
    executionManager: ExecutionManager; // object with all segments loaded
};

export default class LocalWorker implements Worker
{
    #url: string;
    #trustKey?: string;
    #gateway?: Gateway;

    #healthManager: HealthManager;
    #middlewareManager: MiddlewareManager;
    #executionManager: ExecutionManager;

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#trustKey = configuration.trustKey;
        this.#gateway = configuration.gateway;

        this.#healthManager = configuration.healthManager;
        this.#middlewareManager = configuration.middlewareManager;
        this.#executionManager = configuration.executionManager;

        // TODO: Should be done when constructing the middleware manager
        this.#middlewareManager.addMiddleware(new ProcedureRunner(this.#executionManager));

        // TODO: Move runtime registration to the starter script
    }

    get url() { return this.#url; }

    get trustKey() { return this.#trustKey; }

    async start(): Promise<void>
    {
        if (this.#gateway !== undefined)
        {
            await this.#gateway.start();
            await this.#gateway.addWorker(this);
        }
    }

    async stop(): Promise<void>
    {
        if (this.#gateway !== undefined)
        {
            // TODO: Remove worker from gateway (Github issue #410)
            await this.#gateway.stop();
        }
    }

    getProcedureNames(): string[]
    {
        return this.#executionManager.getProcedureNames();
    }

    hasProcedure(name: string): boolean
    {
        return this.#executionManager.hasProcedure(name);
    }
    
    isHealthy(): Promise<boolean>
    {
        return this.#healthManager.isHealthy();
    }

    getHealth(): Promise<Map<string, boolean>>
    {
        return this.#healthManager.getHealth();
    }

    run(request: Request): Promise<Response>
    {
        return this.#mustRunLocal(request)
            ? this.#runLocal(request)
            : this.#runRemote(request);
    }

    #mustRunLocal(request: Request): boolean
    {
        return this.#gateway === undefined
            || this.#executionManager.hasProcedure(request.fqn);
    }

    #runLocal(request: Request): Promise<Response>
    {
        const trustKey = request.getHeader(JITAR_TRUST_HEADER_KEY);
        
        if (trustKey !== undefined && this.#trustKey !== trustKey)
        {
            throw new InvalidTrustKey();
        }
        
        const procedure = this.#executionManager.getProcedure(request.fqn);

        if (trustKey === undefined && procedure!.protected)
        {
            throw new Unauthorized();
        }

        return this.#middlewareManager.handle(request);
    }

    #runRemote(request: Request): Promise<Response>
    {
        if (this.#trustKey !== undefined)
        {
            request.headers.set(JITAR_TRUST_HEADER_KEY, this.#trustKey);
        }

        return this.#gateway!.run(request);
    }
}
