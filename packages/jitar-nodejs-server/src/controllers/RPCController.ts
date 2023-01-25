
import { Controller, Get, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { Logger } from 'tslog';

import { Version, Forbidden, BadRequest, NotFound, NotImplemented, PaymentRequired, Teapot, Unauthorized } from 'jitar';
import { ProcedureContainer, ValueSerializer } from 'jitar';

const RPC_PARAMETERS = ['version', 'serialize'];
const IGNORED_HEADER_KEYS = ['host', 'connection', 'content-length', 'accept-encoding', 'user-agent'];

@Controller('rpc')
export default class RPCController
{
    #runtime: LocalGateway | LocalNode | Proxy;
    #logger: Logger<unknown>;
    #useSerializer: boolean;

    constructor(runtime: LocalGateway | LocalNode | Proxy, logger: Logger<unknown>, useSerializer: boolean)
    {
        this.#runtime = runtime;
        this.#logger = logger;
        this.#useSerializer = useSerializer;

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

    #extractFqn(request: Request): string
    {
        return request.path.substring(1);
    }

    #extractVersion(request: Request): Version
    {
        return request.query.version !== undefined
            ? Version.parse(request.query.version.toString())
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
            ? await ValueSerializer.deserialize(request.body) as unknown
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
        if (this.#runtime.hasProcedure(fqn) === false)
        {
            return response.status(404).send(`Procedure not found -> ${fqn}`);
        }

        try
        {
            const result = await this.#runtime.handle(fqn, version, args, headers);

            this.#logger.info(`Ran procedure -> ${fqn} (${version.toString()})`);

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

    #createResultResponse(result: unknown, response: Response, serialize: boolean): Response
    {
        const content = this.#createResponseContent(result, serialize);
        const contentType = this.#createResponseContentType(content);

        response.setHeader('Content-Type', contentType);

        return response.status(200).send(content);
    }

    #createErrorResponse(error: unknown, errorData: unknown, response: Response, serialize: boolean): Response
    {
        const content = this.#createResponseContent(errorData, serialize);
        const contentType = this.#createResponseContentType(content);
        const statusCode = this.#createResponseStatusCode(error);

        response.setHeader('Content-Type', contentType);

        return response.status(statusCode).send(content);
    }

    #createResponseContent(data: unknown, serialize: boolean): unknown
    {
        return serialize
            ? ValueSerializer.serialize(data)
            : data;
    }

    #createResponseContentType(content: unknown): string
    {
        return typeof content === 'object'
            ? 'application/json'
            : 'text/plain';
    }

    #createResponseStatusCode(error: unknown): number
    {
        if (error instanceof BadRequest)        return 400;
        if (error instanceof Unauthorized)      return 401;
        if (error instanceof PaymentRequired)   return 402;
        if (error instanceof Forbidden)         return 403;
        if (error instanceof NotFound)          return 404;
        if (error instanceof Teapot)            return 418;
        if (error instanceof NotImplemented)    return 501;

        return 500;
    }
}
