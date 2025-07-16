
import { Request, Response, StatusCodes } from '@jitar/execution';
import type { ModuleImporter } from '@jitar/sourcing';

import States from './definitions/States';
import type { State } from './definitions/States';
import InvalidMiddleware from './errors/InvalidMiddleware';
import type Middleware from './interfaces/Middleware';
import type NextHandler from './types/NextHandler';

export default class MiddlewareManager
{
    #state: State = States.STOPPED;
    #middlewares: Middleware[] = [];

    readonly #moduleImporter: ModuleImporter;
    readonly #middlewareFiles: string[];

    constructor(moduleImporter: ModuleImporter, middlewareFiles: string[] = [])
    {
        this.#moduleImporter = moduleImporter;
        this.#middlewareFiles = middlewareFiles;
    }

    get state() { return this.#state; }

    async start(): Promise<void>
    {
        if (this.#state !== States.STOPPED)
        {
            return;
        }

        try
        {
            this.#state = States.STARTING;

            await this.#loadMiddlewares();

            this.#state = States.STARTED;
        }
        catch (error: unknown)
        {
            this.#state = States.STOPPED;

            throw error;
        }
    }

    async stop(): Promise<void>
    {
        if (this.#state !== States.STARTED)
        {
            return;
        }

        try
        {
            this.#state = States.STOPPING;

            this.clearMiddlewares();

            this.#state = States.STOPPED;
        }
        catch (error: unknown)
        {
            this.#state = States.STARTED;

            throw error;
        }
    }

    async loadMiddleware(filename: string): Promise<void>
    {
        const middleware = await this.#loadMiddleware(filename);

        this.addMiddleware(middleware);
    }

    addMiddleware(middleware: Middleware): void
    {
        if (middleware?.handle === undefined)
        {
            throw new InvalidMiddleware();
        }

        this.#middlewares.push(middleware);
    }

    getMiddleware(type: Function): Middleware | undefined
    {
        return this.#middlewares.find(middleware => middleware instanceof type);
    }

    clearMiddlewares(): void
    {
        this.#middlewares = [];
    }

    handle(request: Request): Promise<Response>
    {
        // Middleware will be executed in the order they were added.
        
        const startHandler = this.#getNextHandler(request, 0);

        return startHandler();
    }

    async #loadMiddlewares(): Promise<void>
    {
        const middlewares = await Promise.all(this.#middlewareFiles.map(filename => this.#loadMiddleware(filename)));

        middlewares.forEach(middleware => this.addMiddleware(middleware));
    }

    async #loadMiddleware(filename: string): Promise<Middleware>
    {
        const module = await this.#moduleImporter.import(filename);

        return module.default as Middleware;
    }

    #getNextHandler(request: Request, index: number): NextHandler
    {
        const next = this.#middlewares[index];

        if (next === undefined)
        {
            return async () => new Response(StatusCodes.OK);
        }

        const nextHandler = this.#getNextHandler(request, index + 1);

        return async () => { return next.handle(request, nextHandler); };
    }
}
