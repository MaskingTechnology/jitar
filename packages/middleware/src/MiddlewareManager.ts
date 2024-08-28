
import { Request, Response } from '@jitar/execution';
import { SourcingManager } from '@jitar/sourcing';

import InvalidMiddleware from './errors/InvalidMiddleware';
import Middleware from './interfaces/Middleware';
import NextHandler from './types/NextHandler';

export default class MiddlewareManager
{
    #sourcingManager: SourcingManager;
    #middlewares: Middleware[] = [];

    constructor(sourcingManager: SourcingManager)
    {
        this.#sourcingManager = sourcingManager;
    }

    async importMiddleware(filename: string): Promise<void>
    {
        const module = await this.#sourcingManager.import(filename);
        const middleware = module.default as Middleware;

        if (middleware?.handle === undefined)
        {
            throw new InvalidMiddleware(filename);
        }

        this.addMiddleware(middleware);
    }

    addMiddleware(middleware: Middleware): void
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
            return async () => new Response();
        }

        const nextHandler = this.#getNextHandler(request, index + 1);

        return async () => { return next.handle(request, nextHandler); };
    }
}
