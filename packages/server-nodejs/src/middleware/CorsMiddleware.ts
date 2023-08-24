
import { Middleware, NextHandler, Request } from '@jitar/runtime';

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

    async handle(request: Request, next: NextHandler): Promise<unknown>
    {
        const result = await next();

        this.#setHeaders(request);

        return result;
    }

    #setHeaders(request: Request): void
    {
        request.setHeader('Access-Control-Allow-Origin', this.#allowOrigin);
        request.setHeader('Access-Control-Allow-Methods', this.#allowMethods);
        request.setHeader('Access-Control-Allow-Headers', this.#allowHeaders);
    }
}
