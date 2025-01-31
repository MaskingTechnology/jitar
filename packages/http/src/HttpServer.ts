
import express, { Express, NextFunction, Request, Response } from 'express';
import { Server as Http } from 'http';

import { RunModes } from '@jitar/execution';
import { ContentTypes, Server, ServerResponse } from '@jitar/runtime';
import { Validator } from '@jitar/validation';

import Defaults from './definitions/Defaults';
import HeaderKeys from './definitions/HeaderKeys';
import HeaderValues from './definitions/HeaderValues';
import IgnoredHeaderKeys from './definitions/IgnoredHeaderKeys';

export default class HttpServer
{
    readonly #server: Server;
    readonly #port: string;
    readonly #app: Express;
    #http?: Http;

    readonly #validator = new Validator();

    constructor(server: Server, port: string = Defaults.PORT_NUMBER, bodyLimit: number = Defaults.BODY_LIMIT)
    {
        this.#server = server;
        this.#port = port;
        this.#app = express();

        this.#setupExpress(bodyLimit);
        this.#setupRoutes();
    }

    async start(): Promise<void>
    {
        await this.#server.start();

        return this.#startHttp();
    }

    async stop(): Promise<void>
    {
        await this.#stopHttp();

        return this.#server.stop();
    }

    #setupExpress(bodyLimit: number): void
    {
        this.#app.use(express.json({ limit: bodyLimit }));
        this.#app.use(express.urlencoded({ extended: true }));
        this.#app.use(this.#addDefaultHeaders.bind(this));

        this.#app.disable(HeaderKeys.POWERED_BY);
    }

    #setupRoutes(): void
    {
        this.#app.get('/health', (request, response) => { this.#getHealth(request, response); });
        this.#app.get('/health/status', (request, response) => { this.#isHealthy(request, response); });
        this.#app.get('/rpc/*procedure', (request, response) => { this.#runGet(request, response); });
        this.#app.post('/rpc/*procedure', (request, response) => { this.#runPost(request, response); });
        this.#app.options('/rpc/*procedure', (request, response) => { this.#runOptions(request, response); });
        this.#app.post('/workers', (request, response) => { this.#addWorker(request, response); });
        this.#app.delete('/workers/:id', (request, response) => { this.#removeWorker(request, response); });
        this.#app.use((request, response) => { this.#provide(request, response); });
    }

    #startHttp(): Promise<void>
    {
        if (this.#http !== undefined)
        {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => 
        {
            this.#http = this.#app.listen(this.#port, reject);

            resolve();
        });
    }

    #stopHttp(): Promise<void>
    {
        if (this.#http === undefined)
        {
            return Promise.resolve();
        }

        return new Promise(resolve => { this.#http!.close(() => resolve()); });
    }

    #addDefaultHeaders(request: Request, response: Response, next: NextFunction): void
    {
        response.setHeader(HeaderKeys.CONTENT_TYPE_OPTIONS, HeaderValues.NO_SNIFF);

        next();
    }

    async #getHealth(request: Request, response: Response): Promise<Response>
    {
        const serverResponse = await this.#server.getHealth();

        return this.#transformResponse(response, serverResponse);
    }

    async #isHealthy(request: Request, response: Response): Promise<Response>
    {
        const serverResponse = await this.#server.isHealthy();

        return this.#transformResponse(response, serverResponse);
    }

    async #runGet(request: Request, response: Response): Promise<Response>
    {
        const fqn = this.#extractFqn(request);
        const version = this.#extractVersion(request);
        const args = this.#extractQueryArguments(request);
        const headers = this.#extractHeaders(request);
        const mode = RunModes.NORMAL;

        const serverResponse = await this.#server.run({ fqn, version, args, headers, mode });

        return this.#transformResponse(response, serverResponse);
    }

    async #runPost(request: Request, response: Response): Promise<Response>
    {
        const fqn = this.#extractFqn(request);
        const version = this.#extractVersion(request);
        const args = this.#extractBodyArguments(request);
        const headers = this.#extractHeaders(request);
        const mode = RunModes.NORMAL;

        const serverResponse = await this.#server.run({ fqn, version, args, headers, mode });

        return this.#transformResponse(response, serverResponse);
    }

    async #runOptions(request: Request, response: Response): Promise<Response>
    {
        // Perform a dry run

        const fqn = this.#extractFqn(request);
        const version = this.#extractVersion(request);
        const args = this.#extractBodyArguments(request);
        const headers = this.#extractHeaders(request);
        const mode = RunModes.DRY;

        const serverResponse = await this.#server.run({ fqn, version, args, headers, mode });

        return this.#transformResponse(response, serverResponse);
    }

    async #addWorker(request: Request, response: Response): Promise<Response>
    {
        const args = this.#extractBodyArguments(request);

        const validation = this.#validator.validate(args,
        {
            url: { type: 'url', required: true },
            procedureNames: { type: 'list', required: true, items: { type: 'string' } },
            trustKey: { type: 'string', required: false }
        });

        if (validation.valid === false)
        {
            return response.status(400).send(validation.errors.join('\n'));
        }

        const url = args.url as string;
        const procedureNames = args.procedureNames as string[];
        const trustKey = args.trustKey as string | undefined;

        try
        {
            const serverResponse = await this.#server.addWorker({ url, procedureNames, trustKey });

            return this.#transformResponse(response, serverResponse);
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : 'Server error';

            return response.status(500).send(message);
        }
    }

    async #removeWorker(request: Request, response: Response): Promise<Response>
    {
        const args = { id: request.params.id };

        const validation = this.#validator.validate(args,
        {
            id: { type: 'string', required: true },
        });

        if (validation.valid === false)
        {
            return response.status(400).send(validation.errors.join('\n'));
        }

        const id = args.id as string;

        try
        {
            const serverResponse = await this.#server.removeWorker({ id });

            return this.#transformResponse(response, serverResponse);
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : 'Server error';

            return response.status(500).send(message);
        }
    }

    async #provide(request: Request, response: Response): Promise<Response>
    {
        const path = request.path.substring(1).trim();
        const filename = decodeURIComponent(path);

        const serverResponse = await this.#server.provide({ filename });

        return this.#transformResponse(response, serverResponse);
    }

    #extractFqn(request: Request): string
    {
        const decodedFqn = decodeURIComponent(request.path.trim());

        return decodedFqn.substring(5).trim();
    }

    #extractVersion(request: Request): string | undefined
    {
        const versionString = request.headers[HeaderKeys.JITAR_PROCEDURE_VERSION];

        return Array.isArray(versionString) ? versionString[0] : versionString;
    }

    #extractQueryArguments(request: Request): Record<string, unknown>
    {
        const args: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(request.query))
        {
            args[key] = value;
        }

        return args;
    }

    #extractBodyArguments(request: Request): Record<string, unknown>
    {
        return request.body;
    }

    #extractHeaders(request: Request): Record<string, string>
    {
        const headers: Record<string, string> = {};

        for (const [key, value] of Object.entries(request.headers))
        {
            if (value === undefined) continue;

            const lowerKey = key.toLowerCase();
            const stringValue = value.toString();

            if (IgnoredHeaderKeys.includes(lowerKey))
            {
                continue;
            }

            headers[lowerKey] = stringValue;
        }

        return headers;
    }

    #transformResponse(response: Response, serverResponse: ServerResponse): Response
    {
        const status = this.#transformStatus(serverResponse);
        const contentType = this.#transformContentType(serverResponse);

        response.status(status);
        response.setHeader(HeaderKeys.CONTENT_TYPE, contentType);
        response.setHeader(HeaderKeys.JITAR_CONTENT_TYPE, serverResponse.contentType);

        for (const [name, value] of Object.entries(serverResponse.headers))
        {
            response.setHeader(name, value);
        }

        const result = this.#transformResult(serverResponse);

        return response.send(result);
    }

    #transformStatus(serverResponse: ServerResponse): number
    {
        if (serverResponse.headers.location !== undefined)
        {
            return 302;
        }

        return serverResponse.status;
    }

    #transformContentType(serverResponse: ServerResponse): string
    {
        const contentType = serverResponse.contentType.toLowerCase();

        switch (contentType)
        {
            case ContentTypes.BOOLEAN:
            case ContentTypes.NUMBER:
            case ContentTypes.UNDEFINED:
            case ContentTypes.NULL:
                return ContentTypes.TEXT;
        }

        return contentType;
    }

    #transformResult(serverResponse: ServerResponse): unknown
    {
        const result = serverResponse.result;

        if (typeof result === 'number' || typeof result === 'boolean')
        {
            return String(result);
        }

        return result;
    }
}
