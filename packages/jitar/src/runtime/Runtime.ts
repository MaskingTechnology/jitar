
import Version from '../core/Version.js';

import HealthCheck from './interfaces/HealthCheck.js';
import Middleware from './interfaces/Middleware.js';

import NextHandler from './types/NextHandler.js';

export default abstract class Runtime
{
    #url?: string;
    #healthChecks: Map<string, HealthCheck> = new Map();
    #middlewares: Middleware[] = [];

    constructor(url?: string)
    {
        this.#url = url;
    }

    get url() { return this.#url; }

    addHealthCheck(name: string, healthCheck: HealthCheck): void
    {
        this.#healthChecks.set(name, healthCheck);
    }

    async isHealthy(): Promise<boolean>
    {
        for (const healthCheck of this.#healthChecks.values())
        {
            if (await healthCheck.isHealthy() === false)
            {
                return false;
            }
        }

        return true;
    }

    async getHealth(): Promise<Map<string, boolean>>
    {
        const health: Map<string, boolean> = new Map();

        for (const [name, healthCheck] of this.#healthChecks)
        {
            const healthy = await healthCheck.isHealthy();

            health.set(name, healthy);
        }

        return health;
    }

    addMiddleware(middleware: Middleware)
    {
        this.#middlewares.push(middleware);
    }

    handle(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>)
    {
        const startHandler = this.#getNextHandler(fqn, version, args, headers, 0);

        return startHandler();
    }

    #getNextHandler(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>, index: number): NextHandler
    {
        // Reverse the index so that the first middleware added is the last one to be called
        const indexFromEnd = this.#middlewares.length - index - 1;
        const next = this.#middlewares[indexFromEnd];

        if (next === undefined)
        {
            return async () => {};
        }

        const nextHandler = this.#getNextHandler(fqn, version, args, headers, index + 1);

        return async () => { return next.handle(fqn, version, args, headers, nextHandler); }
    }
}
