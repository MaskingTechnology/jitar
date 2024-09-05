
import { BadRequest, Forbidden, NotFound, NotImplemented, PaymentRequired, Teapot, Unauthorized } from '@jitar/errors';
import { Request, Version, VersionParser } from '@jitar/execution';
import type { File, SourcingManager } from '@jitar/sourcing';

import LocalGateway from '../gateway/LocalGateway';
import LocalWorker from '../worker/LocalWorker';
import RemoteWorker from '../worker/RemoteWorker';
import Proxy from '../proxy/Proxy';

import ContentTypes from './definitions/ContentTypes';
import StatusCodes from './definitions/StatusCodes';

import type ServerResponse from './types/ServerResponse';
import type AddWorkerRequest from './types/AddWorkerRequest';
import type ProvideRequest from './types/ProvideRequest';
import type RunRequest from './types/RunRequest';

type Configuration =
{
    proxy: Proxy;
    sourcingManager: SourcingManager;
    setUpScripts?: string[];
    tearDownScripts?: string[];
};

export default class Server
{
    #proxy: Proxy;
    #sourcingManager: SourcingManager;
    #setUpScripts: string[];
    #tearDownScripts: string[];

    constructor(configuration: Configuration)
    {
        this.#proxy = configuration.proxy;
        this.#sourcingManager = configuration.sourcingManager;
        this.#setUpScripts = configuration.setUpScripts ?? [];
        this.#tearDownScripts = configuration.tearDownScripts ?? [];
    }

    get proxy() { return this.#proxy; }

    async start(): Promise<void>
    {
        await this.#setUp();

        await this.#proxy.start();

        console.log(`Server started at ${this.#proxy.url}`);
        
        if (this.#proxy.runner instanceof LocalWorker)
        {
            console.log('RPC procedures:', this.#proxy.runner.getProcedureNames());
        }
    }

    async stop(): Promise<void>
    {
        await this.#proxy.stop();

        await this.#tearDown();

        console.log('Server stopped');
    }

    async getHealth(): Promise<ServerResponse>
    {
        try
        {
            const health = await this.#proxy.getHealth();

            return this.#respondHealth(health);
        }
        catch (error: unknown)
        {
            return this.#respondError(error);
        }
    }

    async isHealthy(): Promise<ServerResponse>
    {
        try
        {
            const healthy = await this.#proxy.isHealthy();

            return this.#respondHealthy(healthy);
        }
        catch (error: unknown)
        {
            return this.#respondError(error);
        }
    }

    async provide(provideRequest: ProvideRequest): Promise<ServerResponse>
    {
        try
        {
            const file = await this.#proxy.provide(provideRequest.filename);

            return this.#respondFile(file);
        }
        catch (error: unknown)
        {
            return this.#respondError(error);
        }
    }

    async run(runRequest: RunRequest): Promise<ServerResponse>
    {
            const request = this.#transformRunRequest(runRequest);

            // TODO: remove this line when the client works again
            request.setHeader('X-Jitar-Data-Encoding', 'serialized');

            const response = await this.#proxy.run(request);

            return response.success
                ? this.#respondResult(response.result, response.headers)
                : this.#respondError(response.result);
    }

    async addWorker(addRequest: AddWorkerRequest): Promise<ServerResponse>
    {
        try
        {
            const runner = this.#proxy.runner;

            if ((runner instanceof LocalGateway) === false)
            {
                throw new BadRequest('Cannot add worker to remote gateway');
            }

            const worker = this.#buildRemoteWorker(addRequest.url, addRequest.procedures);

            await runner.addWorker(worker);

            return this.#respondSuccess();
        }
        catch (error: unknown)
        {
            return this.#respondError(error);
        }
    }

    #setUp(): Promise<void>
    {
        return this.#runScripts(this.#setUpScripts);
    }

    #tearDown(): Promise<void>
    {
        return this.#runScripts(this.#tearDownScripts);
    }

    async #runScripts(scripts: string[]): Promise<void>
    {
        await Promise.all(scripts.map(script => this.#sourcingManager.import(script)));
    }

    #transformRunRequest(request: RunRequest): Request
    {
        const fqn = this.#processFqn(request.fqn);
        const version = this.#parseVersion(request.version);
        const args = this.#mapArguments(request.args);
        const headers = this.#mapHeaders(request.headers);

        return new Request(fqn, version, args, headers);
    }

    #processFqn(fqn: string): string
    {
        if (fqn.length === 0)
        {
            throw new BadRequest('Missing procedure name');
        }

        if (fqn.includes('..'))
        {
            throw new BadRequest('Invalid procedure name');
        }

        return fqn;
    }

    #parseVersion(version?: string): Version
    {
        if (typeof version !== 'string')
        {
            return Version.DEFAULT;
        }

        return VersionParser.parse(version);
    }

    #mapArguments(args: Record<string, unknown>): Map<string, unknown>
    {
        return new Map<string, unknown>(Object.entries(args));
    }

    #mapHeaders(headers: Record<string, string>): Map<string, string>
    {
        const map = new Map<string, string>();

        for (const [key, value] of Object.entries(headers))
        {
            if (value === undefined) continue;

            const lowerKey = key.toLowerCase();
            const stringValue = value.toString();

            map.set(lowerKey, stringValue);
        }

        return map;
    }

    #respondHealth(health: Map<string, boolean>): ServerResponse
    {
        const result = Object.fromEntries(health);
        const contentType = ContentTypes.JSON;
        const headers = {};
        const status = StatusCodes.OK;

        return { result, contentType, headers, status };
    }

    #respondHealthy(healthy: boolean): ServerResponse
    {
        const result = healthy;
        const contentType = ContentTypes.BOOLEAN;
        const headers = {};
        const status = StatusCodes.OK;

        return { result, contentType, headers, status };
    }

    #respondFile(file: File): ServerResponse
    {
        const result = file.content;
        const contentType = file.type;
        const headers = {};
        const status = StatusCodes.OK;

        return { result, contentType, headers, status };
    }

    #respondResult(result: unknown, headerMap: Map<string, string>): ServerResponse
    {
        const contentType = this.#determineContentType(result);
        const headers = this.#unmapHeaders(headerMap);
        const status = StatusCodes.OK;

        return { result, contentType, headers, status };
    }

    #respondError(error: unknown): ServerResponse
    {
        const result = error instanceof Error ? error.message : error;
        const contentType = this.#determineContentType(result);
        const headers = {};
        const status = this.#determineStatusCode(error);

        return { result, contentType, headers, status };
    }

    #respondSuccess(): ServerResponse
    {
        const result = undefined;
        const contentType = ContentTypes.TEXT;
        const headers = {};
        const status = StatusCodes.OK;

        return { result, contentType, headers, status };
    }

    #determineContentType(content: unknown): string
    {
        switch(typeof content)
        {
            case 'boolean': return ContentTypes.BOOLEAN;
            case 'number': return ContentTypes.NUMBER;
            case 'object': return ContentTypes.JSON;
            default: return ContentTypes.TEXT;
        }
    }

    #unmapHeaders(headers: Map<string, string>): Record<string, string>
    {
        return Object.fromEntries(headers);
    }

    #determineStatusCode(error: unknown): number
    {
        if (error instanceof BadRequest) return StatusCodes.BAD_REQUEST;
        if (error instanceof Forbidden) return StatusCodes.FORBIDDEN;
        if (error instanceof NotFound) return StatusCodes.NOT_FOUND;
        if (error instanceof NotImplemented) return StatusCodes.NOT_IMPLEMENTED;
        if (error instanceof PaymentRequired) return StatusCodes.PAYMENT_REQUIRED;
        if (error instanceof Teapot) return StatusCodes.TEAPOT;
        if (error instanceof Unauthorized) return StatusCodes.UNAUTHORIZED;

        return StatusCodes.SERVER_ERROR;
    }

    #buildRemoteWorker(url: string, procedures: string[]): RemoteWorker
    {
        const procedureNames = new Set<string>(procedures);

        return new RemoteWorker({ url, procedureNames });
    }
}
