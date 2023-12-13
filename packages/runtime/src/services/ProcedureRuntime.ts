
import { ExecutionScope, ExecutionScopes } from '../definitions/ExecutionScope.js';

import InvalidMiddleware from '../errors/InvalidMiddleware.js';

import Middleware from '../interfaces/Middleware.js';
import Runner from '../interfaces/Runner.js';

import Request from '../models/Request.js';
import Response from '../models/Response.js';

import Module from '../types/Module.js';
import NextHandler from '../types/NextHandler.js';

import ProcedureRunner from './ProcedureRunner.js';
import Repository from './Repository.js';
import Runtime from './Runtime.js';

export default abstract class ProcedureRuntime extends Runtime implements Runner
{
    #repository: Repository;
    #middlewares: Middleware[] = [];

    constructor(repository: Repository, url?: string)
    {
        super(url);

        this.#repository = repository;

        this.#middlewares.push(new ProcedureRunner(this));
    }

    get repository() { return this.#repository; }

    abstract getProcedureNames(): string[];

    abstract hasProcedure(name: string): boolean;

    abstract run(request: Request): Promise<Response>;

    import(url: string, scope: ExecutionScope): Promise<Module>
    {
        return this.#repository.import(url, scope);
    }

    async importMiddleware(url: string): Promise<void>
    {
        const module = await this.import(url, ExecutionScopes.APPLICATION);
        const middleware = module.default as Middleware;

        if (middleware?.handle === undefined)
        {
            throw new InvalidMiddleware(url);
        }

        this.addMiddleware(middleware);
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
}
