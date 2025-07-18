
import { BadRequest, Forbidden, NotFound, NotImplemented, PaymentRequired, Teapot, Unauthorized } from '@jitar/errors';
import type { Response } from '@jitar/execution';
import { Request, Version, VersionParser } from '@jitar/execution';
import { Logger } from '@jitar/logging';
import type { MiddlewareManager } from '@jitar/middleware';
import { LocalGateway, LocalWorker, LocalProxy, RemoteWorkerBuilder, State, States } from '@jitar/services';
import type { File, SourcingManager } from '@jitar/sourcing';

import ProcedureRunner from '../ProcedureRunner';
import Runtime from '../Runtime';

import ContentTypes from './definitions/ContentTypes';
import StatusCodes from './definitions/StatusCodes';

import AddWorkerRequest from './types/AddWorkerRequest';
import ProvideRequest from './types/ProvideRequest';
import RemoveWorkerRequest from './types/RemoveWorkerRequest';
import ReportWorkerRequest from './types/ReportWorkerRequest';
import RunRequest from './types/RunRequest';
import ServerResponse from './types/ServerResponse';

import ResourceManager from './ResourceManager';

type Configuration =
{
    proxy: LocalProxy;
    sourcingManager: SourcingManager;
    remoteWorkerBuilder: RemoteWorkerBuilder;
    resourceManager: ResourceManager;
    middlewareManager: MiddlewareManager;
    logger: Logger;
};

export default class Server extends Runtime
{
    readonly #proxy: LocalProxy;
    readonly #remoteWorkerBuilder: RemoteWorkerBuilder;
    readonly #resourceManager: ResourceManager;
    readonly #middlewareManager: MiddlewareManager;

    readonly #logger: Logger;
    readonly #versionParser = new VersionParser();

    constructor(configuration: Configuration)
    {
        super();

        this.#proxy = configuration.proxy;
        this.#remoteWorkerBuilder = configuration.remoteWorkerBuilder;
        this.#resourceManager = configuration.resourceManager;
        this.#middlewareManager = configuration.middlewareManager;

        this.#logger = configuration.logger;
    }

    get proxy() { return this.#proxy; }

    getTrustKey(): string | undefined
    {
        return this.#proxy.trustKey;
    }

    async start(): Promise<void>
    {
        await this.#setUp();

        this.#logger.info(`Server started at ${this.#proxy.url}`);

        if (this.#proxy.runner instanceof LocalWorker)
        {
            this.#logger.info('RPC procedures:', this.#proxy.runner.getProcedureNames());
        }
    }

    async stop(): Promise<void>
    {
        await this.#tearDown();

        this.#logger.info('Server stopped');
    }

    async getHealth(): Promise<ServerResponse>
    {
        try
        {
            const health = await this.#proxy.getHealth();

            this.#logger.debug('Got health');

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
            const healthy = await this.#proxy.isHealthy();

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
            const gateway = this.#extractLocalGatewayFromProxy();

            const worker = this.#remoteWorkerBuilder.build(addRequest.url, addRequest.procedureNames, addRequest.trustKey);

            const id = await gateway.addWorker(worker);

            this.#logger.info('Added worker:', worker.url);

            return this.#respondSuccess({ id });
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            this.#logger.error('Failed to add worker:', message);

            return this.#respondError(error);
        }
    }

    async reportWorker(reportRequest: ReportWorkerRequest): Promise<ServerResponse>
    {
        try
        {
            const state = this.#translateState(reportRequest.state);

            const gateway = this.#extractLocalGatewayFromProxy();

            await gateway.reportWorker(reportRequest.id, state);

            this.#logger.debug('Reported worker:', reportRequest.id);

            return this.#respondSuccess();
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            this.#logger.error('Failed to report worker:', message);

            return this.#respondError(error);
        }
    }

    async removeWorker(removeRequest: RemoveWorkerRequest): Promise<ServerResponse>
    {
        try
        {
            const gateway = this.#extractLocalGatewayFromProxy();

            await gateway.removeWorker(removeRequest.id);

            this.#logger.info('Removed worker:', removeRequest.id);

            return this.#respondSuccess();
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            this.#logger.error('Failed to remove worker:', message);

            return this.#respondError(error);
        }
    }

    async #setUp(): Promise<void>
    {
        await this.#resourceManager.start();

        await Promise.all(
        [
            this.#proxy.start(),
            this.#middlewareManager.start()
        ]);

        const procedureRunner = new ProcedureRunner(this.#proxy);
        this.#middlewareManager.addMiddleware(procedureRunner);
    }

    async #tearDown(): Promise<void>
    {
        await Promise.all(
        [
            this.#middlewareManager.stop(),
            this.#proxy.stop()
        ]);

        await this.#resourceManager.stop();
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

    #translateState(state: string): State
    {
        const states = Object.values(States) as string[];

        if (states.includes(state) === false)
        {
            throw new BadRequest('Invalid state value');
        }

        return state as State;
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

    #respondSuccess(result?: unknown): ServerResponse
    {
        const contentType = this.#determineContentType(result);
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

    #extractLocalGatewayFromProxy(): LocalGateway
    {
        const runner = this.#proxy.runner;

        if ((runner instanceof LocalGateway) === false)
        {
            throw new BadRequest('Cannot remove worker from remote gateway');
        }

        return runner;
    }
}
