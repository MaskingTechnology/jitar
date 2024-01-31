
import express, { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { Logger } from 'tslog';

import { Request as JitarRequest, Version, VersionParser, ProcedureRuntime, BadRequest, Unauthorized, PaymentRequired, Forbidden, NotFound, Teapot, NotImplemented } from '@jitar/runtime';
import { Serializer } from '@jitar/serialization';

import CorsMiddleware from '../middleware/CorsMiddleware.js';
import Headers from '../definitions/Headers.js';
import ContentTypes from '../definitions/ContentTypes.js';

const RPC_PARAMETERS = ['version', 'serialize'];
const IGNORED_HEADER_KEYS = ['host', 'connection', 'content-length', 'accept-encoding', 'user-agent'];
const CORS_MAX_AGE = 86400;

// Required to work after minification.
const BAD_REQUEST_NAME = BadRequest.name;
const UNAUTHORIZED_NAME = Unauthorized.name;
const PAYMENT_REQUIRED_NAME = PaymentRequired.name;
const FORBIDDEN_NAME = Forbidden.name;
const NOT_FOUND_NAME = NotFound.name;
const TEAPOT_NAME = Teapot.name;
const NOT_IMPLEMENTED_NAME = NotImplemented.name;

export default class RPCController
{
    #runtime: ProcedureRuntime;
    #serializer: Serializer;
    #logger: Logger<unknown>;

    constructor(app: express.Application, runtime: ProcedureRuntime, serializer: Serializer, logger: Logger<unknown>)
    {
        this.#runtime = runtime;
        this.#serializer = serializer;
        this.#logger = logger;

        app.get('/rpc/*', (request: ExpressRequest, response: ExpressResponse) => { this.runGet(request, response); });
        app.post('/rpc/*', (request: ExpressRequest, response: ExpressResponse) => { this.runPost(request, response); });
        app.options('/rpc/*', (request: ExpressRequest, response: ExpressResponse) => { this.runOptions(request, response); });
    }

    async runGet(request: ExpressRequest, response: ExpressResponse): Promise<ExpressResponse>
    {
        try
        {
            const fqn = this.#extractFqn(request);
            const version = this.#extractVersion(request);
            const args = this.#extractQueryArguments(request);
            const headers = this.#extractHeaders(request);
            const serialize = this.#extractSerialize(request);

            return this.#run(fqn, version, args, headers, response, serialize);
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            this.#logger.warn(`Invalid request -> ${message}`);

            return response.status(400).type('text').send(`Invalid request -> ${message}`);
        }
    }

    async runPost(request: ExpressRequest, response: ExpressResponse): Promise<ExpressResponse>
    {
        try
        {
            const fqn = this.#extractFqn(request);
            const version = this.#extractVersion(request);
            const args = this.#extractBodyArguments(request);
            const headers = this.#extractHeaders(request);
            const serialize = this.#extractSerialize(request);

            return this.#run(fqn, version, args, headers, response, serialize);
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            this.#logger.warn(`Invalid request -> ${message}`);

            return response.status(400).type('text').send(`Invalid request -> ${message}`);
        }
    }

    async runOptions(request: ExpressRequest, response: ExpressResponse): Promise<ExpressResponse>
    {
        return this.#setCors(response);
    }

    #extractFqn(request: ExpressRequest): string
    {
        const decodedFqn = decodeURIComponent(request.path.trim());
        const fqn = decodedFqn.substring(5).trim();

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

    #extractVersion(request: ExpressRequest): Version
    {
        const version = request.query.version !== undefined
            ? request.query.version
            : '';

        if (typeof version !== 'string')
        {
            throw new BadRequest('Invalid version number');
        }

        return VersionParser.parse(version);
    }

    #extractSerialize(request: ExpressRequest): boolean
    {
        return request.query.serialize === 'true';
    }

    #extractQueryArguments(request: ExpressRequest): Record<string, unknown>
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

    #extractBodyArguments(request: ExpressRequest): Record<string, unknown>
    {
        return request.body;
    }

    #extractHeaders(request: ExpressRequest): Map<string, string>
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

    async #run(fqn: string, version: Version, args: Record<string, unknown>, headers: Map<string, string>, response: ExpressResponse, serialize: boolean): Promise<ExpressResponse>
    {
        if (this.#runtime.hasProcedure(fqn) === false)
        {
            // We need this check to make sure we won't run an private procedure.
            response.setHeader(Headers.CONTENT_TYPE, ContentTypes.TEXT);

            return response.status(404).send(`Procedure not found -> ${fqn}`);
        }

        try
        {
            const deserializedArgs = await this.#serializer.deserialize(args) as Record<string, unknown>;
            const argsMap = new Map<string, unknown>(Object.entries(deserializedArgs));

            const runtimeRequest = new JitarRequest(fqn, version, argsMap, headers);
            const runtimeResponse = await this.#runtime.handle(runtimeRequest);

            this.#logger.info(`Ran procedure -> ${fqn} (v${version.toString()})`);

            this.#setResponseHeaders(response, runtimeResponse.headers);

            return this.#createResultResponse(runtimeResponse.result, response, serialize);
        }
        catch (error: unknown)
        {
            // When using the RPC API we need to return a human readable error message by default.
            // Only when a serialized result is requested we can return the error object (used by the remote).

            const message = error instanceof Error ? error.message : String(error);
            const errorData = serialize ? error : message;

            this.#logger.error(`Failed to run procedure -> ${fqn} (v${version.toString()}) | ${message}`);

            return this.#createErrorResponse(error, errorData, response, serialize);
        }
    }

    async #setCors(response: ExpressResponse): Promise<ExpressResponse>
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

    async #createResultResponse(result: unknown, response: ExpressResponse, serialize: boolean): Promise<ExpressResponse>
    {
        const content = await this.#createResponseContent(result, serialize);
        const contentType = this.#createResponseContentType(content);
        const responseContent = contentType === ContentTypes.JSON ? content : String(content);

        response.setHeader(Headers.CONTENT_TYPE, contentType);

        return response.status(200).send(responseContent);
    }

    async #createErrorResponse(error: unknown, errorData: unknown, response: ExpressResponse, serialize: boolean): Promise<ExpressResponse>
    {
        const content = await this.#createResponseContent(errorData, serialize);
        const contentType = this.#createResponseContentType(content);
        const statusCode = this.#createResponseStatusCode(error);

        response.setHeader(Headers.CONTENT_TYPE, contentType);

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
        switch(typeof content)
        {
            case 'boolean': return ContentTypes.BOOLEAN;
            case 'number': return ContentTypes.NUMBER;
            case 'object': return ContentTypes.JSON;
            default: return ContentTypes.TEXT;
        }
    }

    #setResponseHeaders(response: ExpressResponse, headers: Map<string, string>): void
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

        if (this.#isClassType(errorClass, BAD_REQUEST_NAME)) return 400;
        if (this.#isClassType(errorClass, UNAUTHORIZED_NAME)) return 401;
        if (this.#isClassType(errorClass, PAYMENT_REQUIRED_NAME)) return 402;
        if (this.#isClassType(errorClass, FORBIDDEN_NAME)) return 403;
        if (this.#isClassType(errorClass, NOT_FOUND_NAME)) return 404;
        if (this.#isClassType(errorClass, TEAPOT_NAME)) return 418;
        if (this.#isClassType(errorClass, NOT_IMPLEMENTED_NAME)) return 501;

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
