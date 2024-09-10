
import express, { Express, Request, Response, NextFunction } from 'express';
import { Server as Http } from 'http';

import { RunModes } from '@jitar/execution';
import type { Server, ServerResponse } from '@jitar/services';
import { Validator } from '@jitar/validation';

const DEFAULT_BODY_LIMIT = 1024 * 200; // 200 KB
const RPC_PARAMETERS = ['version', 'serialize'];
const IGNORED_HEADER_KEYS = ['host', 'connection', 'content-length', 'accept-encoding', 'user-agent', 'keep-alive'];

export default class HttpServer
{
    #validator = new Validator();

    #server: Server;
    #port: string;
    #app: Express;
    #http?: Http;

    constructor(server: Server, port: string, bodyLimit = DEFAULT_BODY_LIMIT)
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
        this.#app.use(express.json({limit: bodyLimit }));
        this.#app.use(express.urlencoded({ extended: true }));
        this.#app.use(this.#addDefaultHeaders.bind(this));

        this.#app.disable('x-powered-by');
    }

    #setupRoutes(): void
    {
        this.#app.get('/health', this.#getHealth.bind(this));
        this.#app.get('/health/status', this.#isHealthy.bind(this));

        this.#app.get('/rpc/*', this.#runGet.bind(this));
        this.#app.post('/rpc/*', this.#runPost.bind(this));
        this.#app.options('/rpc/*', this.#runOptions.bind(this));

        this.#app.post('/workers', this.#addWorker.bind(this));

        this.#app.get('*', this.#provide.bind(this));
    }

    #startHttp(): Promise<void>
    {
        if (this.#http !== undefined)
        {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => 
        { 
            this.#http = this.#app.listen(this.#port, resolve);
            
            this.#http.on('error', reject);
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    #addDefaultHeaders(request: Request, response: Response, next: NextFunction): void
    {
        response.setHeader('X-Content-Type-Options', 'nosniff');

        next();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async #getHealth(request: Request, response: Response): Promise<Response>
    {
        const serverResponse = await this.#server.getHealth();

        return this.#transformResponse(response, serverResponse);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            procedureNames: { type: 'list', required: true, items: { type: 'string' } }
        });

        if (validation.valid === false)
        {
            return response.status(400).send(validation.errors.join('\n'));
        }

        const url = args.url as string;
        const procedureNames = args.procedureNames as string[];

        try
        {
            const serverResponse = await this.#server.addWorker({ url, procedureNames });

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
        return typeof request.query.version === 'string'
            ? request.query.version
            : undefined;
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

            if (IGNORED_HEADER_KEYS.includes(lowerKey))
            {
                continue;
            }

            headers[lowerKey] = stringValue;
        }

        return headers;
    }

    #transformResponse(response: Response, serverResponse: ServerResponse): Response
    {
        response.status(serverResponse.status);

        response.setHeader('Content-Type', serverResponse.contentType);

        for (const [name, value] of Object.entries(serverResponse.headers))
        {
            response.setHeader(name, value);
        }

        return response.send(serverResponse.result);
    }
}
