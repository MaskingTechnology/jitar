
import { Request, Response, ExecutionManager, Implementation, ProcedureNotFound } from '@jitar/execution';
import { HealthManager } from '@jitar/health';
import { MiddlewareManager, ProcedureRunner } from '@jitar/middleware';
import { Serializer, SerializerBuilder } from '@jitar/serialization';

import Gateway from '../gateway/Gateway';
import Worker from './Worker';

import ExecutionClassResolver from './ExecutionClassResolver';
import RequestNotTrusted from './errors/RequestNotTrusted';

const JITAR_TRUST_HEADER_KEY = 'X-Jitar-Trust-Key';
const JITAR_DATA_ENCODING_KEY = 'X-Jitar-Data-Encoding';
const JITAR_DATA_ENCODING_VALUE = 'serialized';

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

    #serializer: Serializer;

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#trustKey = configuration.trustKey;
        this.#gateway = configuration.gateway;

        this.#healthManager = configuration.healthManager;
        this.#middlewareManager = configuration.middlewareManager;
        this.#executionManager = configuration.executionManager;

        const classResolver = new ExecutionClassResolver(this.#executionManager);
        this.#serializer = SerializerBuilder.build(classResolver);

        const procedureRunner = new ProcedureRunner(this.#executionManager);
        this.#middlewareManager.addMiddleware(procedureRunner);
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

    async run(request: Request): Promise<Response>
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

    async #runLocal(request: Request): Promise<Response>
    {
        const procedure = this.#executionManager.getProcedure(request.fqn);
        const implementation = procedure?.getImplementation(request.version);

        if (this.#procedureNotFound(implementation))
        {
            throw new ProcedureNotFound(request.fqn);
        }

        if (this.#requestNotTrusted(request, implementation!))
        {
            throw new RequestNotTrusted();
        }
        
        const dataEncoding = request.getHeader(JITAR_DATA_ENCODING_KEY);

        if (dataEncoding === JITAR_DATA_ENCODING_VALUE)
        {
            request = await this.#deserializeRequest(request);
        }

        request.removeHeader(JITAR_DATA_ENCODING_KEY);

        const response = await this.#middlewareManager.handle(request);

        if (dataEncoding === JITAR_DATA_ENCODING_VALUE)
        {
            return this.#serializeResponse(response);
        }

        return response;
    }

    #procedureNotFound(implementation?: Implementation): boolean
    {
        return implementation === undefined
            || implementation.private;
    }

    #requestNotTrusted(request: Request, implementation: Implementation): boolean
    {
        // Public requests are always allowed
        if (implementation.public) return false;

        const trustKey = request.getHeader(JITAR_TRUST_HEADER_KEY);

        return this.#trustKey !== trustKey;
    }

    async #runRemote(request: Request): Promise<Response>
    {
        request = await this.#serializeRequest(request);

        request.setHeader(JITAR_DATA_ENCODING_KEY, JITAR_DATA_ENCODING_VALUE);

        if (this.#trustKey !== undefined)
        {
            request.setHeader(JITAR_TRUST_HEADER_KEY, this.#trustKey);
        }

        const response = await this.#gateway!.run(request);

        return this.#deserializeResponse(response);
    }

    async #serializeRequest(request: Request): Promise<Request>
    {
        const serializedArgs: Map<string, unknown> = new Map();

        for (const [key, value] of request.args)
        {
            const serializedValue = await this.#serializer.serialize(value);

            serializedArgs.set(key, serializedValue);
        }

        return new Request(request.fqn, request.version, serializedArgs, request.headers, request.mode);
    }

    async #deserializeRequest(request: Request): Promise<Request>
    {
        const deserializedArgs: Map<string, unknown> = new Map();

        for (const [key, value] of request.args)
        {
            const deserializedValue = await this.#serializer.deserialize(value);

            deserializedArgs.set(key, deserializedValue);
        }

        return new Request(request.fqn, request.version, deserializedArgs, request.headers, request.mode);
    }

    async #serializeResponse(response: Response): Promise<Response>
    {
        const serializedResult = await this.#serializer.serialize(response.result);

        return new Response(response.status, serializedResult, response.headers);
    }

    async #deserializeResponse(response: Response): Promise<Response>
    {
        const deserializedResult = await this.#serializer.deserialize(response.result);

        return new Response(response.status, deserializedResult, response.headers);
    }
}
