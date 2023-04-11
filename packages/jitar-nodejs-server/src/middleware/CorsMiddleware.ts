
import { Middleware, NextHandler, Version } from '@jitar/runtime';

export default class CorsMiddleware implements Middleware
{
    #allowOrigin: string;
    #allowMethods = 'GET, POST';
    #allowHeaders: string;

    constructor(origin = '*', headers = '*')
    {
        this.#allowOrigin = origin;
        this.#allowHeaders = headers;
    }

    get allowOrigin() { return this.#allowOrigin; }

    get allowMethods() { return this.#allowMethods; }

    get allowHeaders() { return this.#allowHeaders; }

    async handle(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>, next: NextHandler): Promise<unknown>
    {
        const result = await next();

        this.#setHeaders(headers);

        return result;
    }

    #setHeaders(headers: Map<string, string>): void
    {
        headers.set('Access-Control-Allow-Origin', this.#allowOrigin);
        headers.set('Access-Control-Allow-Methods', this.#allowMethods);
        headers.set('Access-Control-Allow-Headers', this.#allowHeaders);
    }
}
