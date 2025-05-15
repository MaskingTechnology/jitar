
import { Request, Response, StatusCodes } from '@jitar/execution';
import type { ModuleImporter } from '@jitar/sourcing';

import InvalidMiddleware from './errors/InvalidMiddleware';
import type Middleware from './interfaces/Middleware';
import type NextHandler from './types/NextHandler';

export default class MiddlewareManager
{
    readonly #moduleImporter: ModuleImporter;
    readonly #middlewareFiles: string[];

    #middlewares: Middleware[] = [];

    constructor(moduleImporter: ModuleImporter, middlewareFiles: string[] = [])
    {
        this.#moduleImporter = moduleImporter;
        this.#middlewareFiles = middlewareFiles;
    }

    async start(): Promise<void>
    {
        return this.#loadMiddlewares();
    }

    async stop(): Promise<void>
    {
        return this.clearMiddlewares();
    }

    async loadMiddleware(filename:string): Promise<void>
    {
        const module = await this.#moduleImporter.import(filename);

        this.addMiddleware(module.default as Middleware);
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
        await Promise.all(this.#middlewareFiles.map(filename => this.loadMiddleware(filename)));
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
