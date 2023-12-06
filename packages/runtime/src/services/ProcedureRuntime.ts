
import Middleware from '../interfaces/Middleware.js';
import Runner from '../interfaces/Runner.js';

import Request from '../models/Request.js';
import Response from '../models/Response.js';

import NextHandler from '../types/NextHandler.js';

import Runtime from './Runtime.js';
import ProcedureRunner from './ProcedureRunner.js';

export default abstract class ProcedureRuntime extends Runtime implements Runner
{
    #middlewares: Middleware[] = [];

    constructor(url?: string)
    {
        super(url);

        this.#middlewares.push(new ProcedureRunner(this));
    }

    abstract getProcedureNames(): string[];

    abstract hasProcedure(name: string): boolean;

    abstract run(request: Request): Promise<Response>;

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
