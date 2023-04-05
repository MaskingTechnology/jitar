
import { Controller, Get, Options, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from 'tslog';

import { Version, VersionParser, Forbidden, BadRequest, NotFound, NotImplemented, PaymentRequired, Teapot, Unauthorized, ProcedureRuntime } from 'jitar-runtime';
import { Serializer } from 'jitar-serialization';

import CorsMiddleware from '../middleware/CorsMiddleware.js';

const RPC_PARAMETERS = ['version', 'serialize'];
const IGNORED_HEADER_KEYS = ['host', 'connection', 'content-length', 'accept-encoding', 'user-agent'];
const CORS_MAX_AGE = 86400;

@Controller('rpc')
export default class RPCController
{
    #runtime: ProcedureRuntime;
    #serializer: Serializer;
    #useSerializer: boolean;
    #logger: Logger<unknown>;

    constructor(runtime: ProcedureRuntime, serializer: Serializer, useSerializer: boolean, logger: Logger<unknown>)
    {
        this.#runtime = runtime;
        this.#serializer = serializer;
        this.#useSerializer = useSerializer;
        this.#logger = logger;

        this.#showProcedureInfo();
    }

    #showProcedureInfo()
    {
        const procedureNames = this.#runtime.getProcedureNames();

        if (procedureNames.length === 0)
        {
            return;
        }

        procedureNames.sort();

        this.#logger.info('Registered RPC entries', procedureNames);
    }

    @Get('*')
    async runGet(request: Request, response: Response): Promise<Response>
    {
        const fqn = this.#extractFqn(request);
        const version = this.#extractVersion(request);
        const args = this.#extractQueryArguments(request);
        const headers = this.#extractHeaders(request);
        const serialize = this.#extractSerialize(request);

        return this.#run(fqn, version, args, headers, response, serialize);
    }

    @Post('*')
    async runPost(request: Request, response: Response): Promise<Response>
    {
        const fqn = this.#extractFqn(request);
        const version = this.#extractVersion(request);
        const args = await this.#extractBodyArguments(request);
        const headers = this.#extractHeaders(request);
        const serialize = this.#extractSerialize(request);

        return this.#run(fqn, version, args, headers, response, serialize);
    }

    @Options('*')
    async runOptions(request: Request, response: Response): Promise<Response>
    {
        return this.#setCors(response);
    }

    #extractFqn(request: Request): string
    {
        return request.path.substring(1);
    }

    #extractVersion(request: Request): Version
    {
        return request.query.version !== undefined
            ? VersionParser.parse(request.query.version.toString())
            : Version.DEFAULT;
    }

    #extractSerialize(request: Request): boolean
    {
        return request.query.serialize === 'true';
    }

    #extractQueryArguments(request: Request): Map<string, unknown>
    {
        const args = new Map<string, unknown>();

        for (const [key, value] of Object.entries(request.query))
        {
            if (RPC_PARAMETERS.includes(key))
            {
                // We need to filter out the RPC parameters,
                // because they are not a procedure argument.

                continue;
            }

            args.set(key, value);
        }

        return args;
    }

    async #extractBodyArguments(request: Request): Promise<Map<string, unknown>>
    {
        const args = this.#useSerializer
            ? await this.#serializer.deserialize(request.body) as unknown
            : request.body;

        return new Map<string, unknown>(Object.entries(args));
    }

    #extractHeaders(request: Request): Map<string, string>
    {
        const headers = new Map<string, string>();

        for (const [key, value] of Object.entries(request.headers))
        {
            if (value === undefined)
            {
                continue;
            }

            const lowerKey = key.toLowerCase();
            const stringValue = value.toString();

            if (IGNORED_HEADER_KEYS.includes(lowerKey))
            {
                continue;
            }

            headers.set(lowerKey, stringValue);
        }

        return headers;
    }

    async #run(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>, response: Response, serialize: boolean): Promise<Response>
    {
        try
        {
            const result = await this.#runtime.handle(fqn, version, args, headers);

            this.#logger.info(`Ran procedure -> ${fqn} (${version.toString()})`);

            this.#setResponseHeaders(response, headers);

            return this.#createResultResponse(result, response, this.#useSerializer && serialize);
        }
        catch (error: unknown)
        {
            // When using the RPC API we need to return a human readable error message by default.
            // Only when a serialized result is requested we can return the error object (used by the remote).

            const message = error instanceof Error ? error.message : String(error);
            const errorData = serialize ? error : message;

            this.#logger.error(`Failed to run procedure -> ${fqn} (${version.toString()}) | ${message}`);

            return this.#createErrorResponse(error, errorData, response, serialize);
        }
    }

    async #setCors(response: Response): Promise<Response>
    {
        const cors = this.#runtime.getMiddleware(CorsMiddleware) as CorsMiddleware;

        if (cors === undefined)
        {
            return response.status(204).send();
        }

        response.setHeader('Access-Control-Allow-Origin', cors.allowOrigin);
        response.setHeader('Access-Control-Allow-Methods', cors.allowMethods);
        response.setHeader('Access-Control-Allow-Headers', cors.allowHeaders);
        response.setHeader('Access-Control-Max-Age', CORS_MAX_AGE);

        return response.status(204).send();
    }

    async #createResultResponse(result: unknown, response: Response, serialize: boolean): Promise<Response>
    {
        const content = await this.#createResponseContent(result, serialize);
        const contentType = this.#createResponseContentType(content);

        response.setHeader('Content-Type', contentType);

        return response.status(200).send(content);
    }

    async #createErrorResponse(error: unknown, errorData: unknown, response: Response, serialize: boolean): Promise<Response>
    {
        const content = await this.#createResponseContent(errorData, serialize);
        const contentType = this.#createResponseContentType(content);
        const statusCode = this.#createResponseStatusCode(error);

        response.setHeader('Content-Type', contentType);

        return response.status(statusCode).send(content);
    }

    async #createResponseContent(data: unknown, serialize: boolean): Promise<unknown>
    {
        return serialize
            ? this.#serializer.serialize(data)
            : data;
    }

    #createResponseContentType(content: unknown): string
    {
        return typeof content === 'object'
            ? 'application/json'
            : 'text/plain';
    }

    #setResponseHeaders(response: Response, headers: Map<string, string>): void
    {
        headers.forEach((value, key) => response.setHeader(key, value));
    }

    #createResponseStatusCode(error: unknown): number
    {
        if (error instanceof BadRequest) return 400;
        if (error instanceof Unauthorized) return 401;
        if (error instanceof PaymentRequired) return 402;
        if (error instanceof Forbidden) return 403;
        if (error instanceof NotFound) return 404;
        if (error instanceof Teapot) return 418;
        if (error instanceof NotImplemented) return 501;

        return 500;
    }
}
