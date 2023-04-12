
import { Controller, Get, Options, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from 'tslog';

import { Version, VersionParser, ProcedureRuntime } from '@jitar/runtime';
import { Serializer } from '@jitar/serialization';

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

    #extractQueryArguments(request: Request): Record<string, unknown>
    {
        const args: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(request.query))
        {
            if (RPC_PARAMETERS.includes(key))
            {
                // We need to filter out the RPC parameters,
                // because they are not a procedure argument.

                continue;
            }

            args[key] = value;
        }

        return args;
    }

    async #extractBodyArguments(request: Request): Promise<Record<string, unknown>>
    {
        return request.body;
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

    async #run(fqn: string, version: Version, args: Record<string, unknown>, headers: Map<string, string>, response: Response, serialize: boolean): Promise<Response>
    {
        if (this.#runtime.hasProcedure(fqn) === false)
        {
            // We need this check to make sure we won't run an private procedure.
            return response.status(404).send(`Procedure not found -> ${fqn}`);
        }

        try
        {
            if (this.#useSerializer)
            {
                args = await this.#serializer.deserialize(args) as Record<string, unknown>;
            }

            const args2 = new Map<string, unknown>(Object.entries(args));

            const result = await this.#runtime.handle(fqn, version, args2, headers);

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
        if (error instanceof Object === false)
        {
            return 500;
        }

        const errorClass = (error as Object).constructor as Function;

        if (this.#isClassType(errorClass, 'BadRequest')) return 400;
        if (this.#isClassType(errorClass, 'Unauthorized')) return 401;
        if (this.#isClassType(errorClass, 'PaymentRequired')) return 402;
        if (this.#isClassType(errorClass, 'Forbidden')) return 403;
        if (this.#isClassType(errorClass, 'NotFound')) return 404;
        if (this.#isClassType(errorClass, 'Teapot')) return 418;
        if (this.#isClassType(errorClass, 'NotImplemented')) return 501;

        return 500;
    }

    #isClassType(clazz: Function, className: string): boolean
    {
        if (clazz.name === className)
        {
            return true;
        }

        const parentClass = Object.getPrototypeOf(clazz);

        if (parentClass.name === '')
        {
            return false;
        }

        return this.#isClassType(parentClass, className);
    }
}
