
import { Request, Response, StatusCodes } from '@jitar/execution';

import InvalidMiddleware from './errors/InvalidMiddleware';
import type Middleware from './interfaces/Middleware';
import type NextHandler from './types/NextHandler';

export default class MiddlewareManager
{
    #middlewares: Middleware[] = [];

    addMiddleware(middleware: Middleware): void
    {
        if (middleware?.handle === undefined)
        {
            throw new InvalidMiddleware();
        }
        
        // We want to add the middleware before the ProcedureRunner because
        // it is the last middleware that needs to be called.

        const index = this.#middlewares.length - 1;

        this.#middlewares.splice(index, 0, middleware);
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
        const startHandler = this.#getNextHandler(request, 0);

        return startHandler();
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
