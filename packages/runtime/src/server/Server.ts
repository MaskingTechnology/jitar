
import { BadRequest, Forbidden, NotFound, NotImplemented, PaymentRequired, Teapot, Unauthorized } from '@jitar/errors';
import { Request, Version, VersionParser } from '@jitar/execution';
import type { Response } from '@jitar/execution';
import type { MiddlewareManager } from '@jitar/middleware';
import type { HealthManager } from '@jitar/health';
import type { File, SourcingManager } from '@jitar/sourcing';
import { LocalGateway, LocalWorker, RemoteWorker, Proxy, RemoteBuilder } from '@jitar/services';
import { Logger } from '@jitar/logging';

import ProcedureRunner from '../ProcedureRunner';
import Runtime from '../Runtime';

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
    remoteBuilder: RemoteBuilder;
    middlewareManager: MiddlewareManager;
    healthManager: HealthManager;
    setUpScripts?: string[];
    tearDownScripts?: string[];
};

export default class Server extends Runtime
{
    #proxy: Proxy;
    #sourcingManager: SourcingManager;
    #remoteBuilder: RemoteBuilder;
    #middlewareManager: MiddlewareManager;
    #healthManager: HealthManager;
    #setUpScripts: string[];
    #tearDownScripts: string[];

    #logger: Logger = new Logger();
    #versionParser = new VersionParser();

    constructor(configuration: Configuration)
    {
        super();
        
        this.#proxy = configuration.proxy;
        this.#sourcingManager = configuration.sourcingManager;
        this.#remoteBuilder = configuration.remoteBuilder;
        this.#middlewareManager = configuration.middlewareManager;
        this.#healthManager = configuration.healthManager;
        this.#setUpScripts = configuration.setUpScripts ?? [];
        this.#tearDownScripts = configuration.tearDownScripts ?? [];

        const procedureRunner = new ProcedureRunner(this.#proxy);
        this.#middlewareManager.addMiddleware(procedureRunner);
    }

    get proxy() { return this.#proxy; }

    getTrustKey(): string | undefined
    {
        return this.#proxy.trustKey;
    }

    async start(): Promise<void>
    {
        await this.#setUp();

        await this.#proxy.start();

        this.#logger.info(`Server started at ${this.#proxy.url}`);
        
        if (this.#proxy.runner instanceof LocalWorker)
        {
            this.#logger.info('RPC procedures:', this.#proxy.runner.getProcedureNames());
        }
    }

    async stop(): Promise<void>
    {
        await this.#proxy.stop();

        await this.#tearDown();

        this.#logger.info('Server stopped');
    }

    async getHealth(): Promise<ServerResponse>
    {
        try
        {
            const internalHealth = await this.#proxy.getHealth();
            const externalHealth = await this.#healthManager.getHealth();
            const health = new Map([...internalHealth, ...externalHealth]);

            this.#logger.info('Got health');

            return this.#respondHealth(health);
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            this.#logger.error('Failed to get health:', message);

            return this.#respondError(error);
        }
    }

    async isHealthy(): Promise<ServerResponse>
    {
        try
        {
            const internalsHealthy = await this.#proxy.isHealthy();
            const externalsHealthy = await this.#healthManager.isHealthy();
            const healthy = internalsHealthy && externalsHealthy;

            this.#logger.debug('Got health status');

            return this.#respondHealthy(healthy);
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            this.#logger.error('Failed to get health status:', message);

            return this.#respondError(error);
        }
    }

    async provide(provideRequest: ProvideRequest): Promise<ServerResponse>
    {
        try
        {
            const file = await this.#proxy.provide(provideRequest.filename);

            this.#logger.info('Provided file:', provideRequest.filename);

            return this.#respondFile(file);
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            this.#logger.warn('Failed to provide file:', message);

            return this.#respondError(error);
        }
    }

    async run(runRequest: RunRequest): Promise<ServerResponse>
    {
        try
        {
            const request = this.#transformRunRequest(runRequest);

            // Middleware is only executed on external requests.
            const response = await this.#middlewareManager.handle(request);

            this.#logger.info('Ran request:', request.fqn);

            return this.#respondResponse(response);
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            this.#logger.error('Failed run request:', message);

            return this.#respondError(error);
        }
    }

    async runInternal(request: Request): Promise<Response>
    {
        // Middleware is not executed on internal requests.
        return this.#proxy.run(request);
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

            const worker = this.#buildRemoteWorker(addRequest.url, addRequest.procedureNames);

            await runner.addWorker(worker, addRequest.trustKey);

            this.#logger.info('Added worker:', worker.url);

            return this.#respondSuccess();
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            this.#logger.error('Failed to add worker:', message);

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

        return new Request(fqn, version, args, headers, request.mode);
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

        return this.#versionParser.parse(version);
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

    #respondResponse(response: Response): ServerResponse
    {
        const result = response.result instanceof Error ? response.result.message : response.result;
        const contentType = this.#determineContentType(result);
        const headers = this.#unmapHeaders(response.headers);
        const status = response.status;

        return { result, contentType, headers, status };
    }

    #respondError(error: unknown): ServerResponse
    {
        const result = error instanceof Error ? error.message : String(error);
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
        if (content === undefined) return ContentTypes.UNDEFINED;
        if (content === null) return ContentTypes.NULL;

        switch (typeof content)
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
        const remote = this.#remoteBuilder.build(url);
        const procedureNames = new Set<string>(procedures);

        return new RemoteWorker({ url, remote, procedureNames });
    }
}
