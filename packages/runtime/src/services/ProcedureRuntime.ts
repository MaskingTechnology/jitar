
import InvalidMiddleware from '../errors/InvalidMiddleware.js';

import Middleware from '../interfaces/Middleware.js';
import Runner from '../interfaces/Runner.js';

import Request from '../models/Request.js';
import Response from '../models/Response.js';

import Module from '../types/Module.js';
import NextHandler from '../types/NextHandler.js';

import ModuleLoader from '../utils/ModuleLoader.js';

import ProcedureRunner from './ProcedureRunner.js';
import Runtime from './Runtime.js';

export default abstract class ProcedureRuntime extends Runtime implements Runner
{
    #middlewareFiles: Set<string> = new Set();
    #middlewares: Middleware[] = [];

    constructor(url?: string)
    {
        super(url);

        this.#middlewares.push(new ProcedureRunner(this));
    }

    set middlewareFiles(filenames: Set<string>)
    {
        this.#middlewareFiles = filenames;
    }

    async start(): Promise<void>
    {
        await super.start();

        await this.#importMiddlewares();
    }

    async stop(): Promise<void>
    {
        this.#clearMiddlewares();

        await super.stop();
    }

    abstract getProcedureNames(): string[];

    abstract hasProcedure(name: string): boolean;

    abstract run(request: Request): Promise<Response>;

    import(specifier: string): Promise<Module>
    {
        return ModuleLoader.load(specifier);
    }

    addMiddleware(middleware: Middleware)
    {
        // We want to add the middleware before the ProcedureRunner because
        // it is the last middleware that needs to be called.

        const index = this.#middlewares.length - 1;

        this.#middlewares.splice(index, 0, middleware);
    }

    getMiddleware(type: Function): Middleware | undefined
    {
        return this.#middlewares.find(middleware => middleware instanceof type);
    }

    handle(request: Request): Promise<Response>
    {
        const startHandler = this.#getNextHandler(request, 0);

        return startHandler();
    }

    #getNextHandler(request: Request, index: number): NextHandler
    {
        const next = this.#middlewares[index];

        if (next === undefined)
        {
            return async () => new Response();
        }

        const nextHandler = this.#getNextHandler(request, index + 1);

        return async () => { return next.handle(request, nextHandler); };
    }

    async #importMiddlewares(): Promise<void>
    {
        for (const url of this.#middlewareFiles)
        {
            await this.#importMiddleware(url);
        }
    }

    async #importMiddleware(specifier: string): Promise<void>
    {
        const module = await this.import(specifier);
        const middleware = module.default as Middleware;

        if (middleware?.handle === undefined)
        {
            throw new InvalidMiddleware(specifier);
        }

        this.addMiddleware(middleware);
    }

    #clearMiddlewares(): void
    {
        this.#middlewares = [];
    }
}
