
import { ExecutionManager, Implementation, ProcedureNotFound, Request, Response } from '@jitar/execution';
import { HealthManager } from '@jitar/health';
import { Serializer, SerializerBuilder } from '@jitar/serialization';

import Gateway from '../gateway/Gateway';
import Worker from './Worker';

import ExecutionClassResolver from './ExecutionClassResolver';
import ReportManager from './ReportManager';
import States from '../common/definitions/States';
import type { State } from '../common/definitions/States';
import RequestNotTrusted from './errors/RequestNotTrusted';

const JITAR_TRUST_HEADER_KEY = 'X-Jitar-Trust-Key';
const JITAR_DATA_ENCODING_KEY = 'X-Jitar-Data-Encoding';
const JITAR_DATA_ENCODING_VALUE = 'serialized';

type Configuration =
{
    url: string;
    trustKey?: string;
    gateway?: Gateway;
    registerAtGateway?: boolean;
    executionManager: ExecutionManager;
    healthManager: HealthManager;
    reportFrequency?: number;
};

export default class LocalWorker implements Worker
{
    #id: string | undefined;
    #state: State = States.DISCONNECTED;

    readonly #url: string;
    readonly #trustKey?: string;
    readonly #gateway?: Gateway;
    readonly #registerAtGateway: boolean;
    readonly #executionManager: ExecutionManager;
    readonly #healthManager: HealthManager;
    readonly #reportManager: ReportManager;
    readonly #serializer: Serializer;

    constructor(configuration: Configuration)
    {
        this.#url = configuration.url;
        this.#trustKey = configuration.trustKey;
        this.#gateway = configuration.gateway;
        this.#registerAtGateway = configuration.registerAtGateway === true;

        this.#executionManager = configuration.executionManager;
        this.#healthManager = configuration.healthManager;
        this.#reportManager = new ReportManager(this, configuration.reportFrequency);

        const classResolver = new ExecutionClassResolver(this.#executionManager);
        this.#serializer = SerializerBuilder.build(classResolver);
    }

    get id(): string | undefined { return this.#id; }

    set id(id: string) { this.#id = id; }

    get state(): State { return this.#state; }
    
    set state(state: State) { this.#state = state; }

    get url() { return this.#url; }

    get trustKey() { return this.#trustKey; }

    async start(): Promise<void>
    {
        this.#state = States.STARTING;

        await Promise.all([
            this.#executionManager.start(),
            this.#healthManager.start()
        ]);

        if (this.#gateway !== undefined)
        {
            await this.#gateway.start();

            if (this.#registerAtGateway)
            {
                this.#id = await this.#gateway.addWorker(this);

                this.#reportManager.start();
            }
        }

        await this.updateState();
    }

    async stop(): Promise<void>
    {
        this.#state = States.STOPPING;

        if (this.#gateway !== undefined)
        {
            if (this.#id !== undefined)
            {
                this.#reportManager.stop();

                await this.#gateway.removeWorker(this.#id);
            }

            await this.#gateway.stop();
        }
        
        await Promise.all([
            this.#healthManager.stop(),
            this.#executionManager.stop()
        ]);

        this.#state = States.DISCONNECTED;
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

    async updateState(): Promise<State>
    {
        const healthy = await this.isHealthy();

        this.#state = healthy ? States.HEALTHY : States.UNHEALTHY;

        return this.#state;
    }

    async reportAtGateway(): Promise<void>
    {
        if (this.#gateway === undefined || this.#id === undefined)
        {
            return;
        }

        return this.#gateway.reportWorker(this.#id, this.#state);
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

        if (this.#requestNotTrusted(request, implementation as Implementation))
        {
            throw new RequestNotTrusted();
        }

        const dataEncoding = request.getHeader(JITAR_DATA_ENCODING_KEY);

        if (dataEncoding === JITAR_DATA_ENCODING_VALUE)
        {
            request = await this.#deserializeRequest(request);
        }

        request.removeHeader(JITAR_DATA_ENCODING_KEY);

        const response = await this.#executionManager.run(request);

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

        const response = await (this.#gateway as Gateway).run(request);

        return this.#deserializeResponse(response);
    }

    async #serializeRequest(request: Request): Promise<Request>
    {
        const serializedArgs = new Map<string, unknown>();

        for (const [key, value] of request.args)
        {
            const serializedValue = await this.#serializer.serialize(value);

            serializedArgs.set(key, serializedValue);
        }

        return new Request(request.fqn, request.version, serializedArgs, request.headers, request.mode);
    }

    async #deserializeRequest(request: Request): Promise<Request>
    {
        const deserializedArgs = new Map<string, unknown>();

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
