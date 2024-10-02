
import { Request, Response } from '@jitar/execution';
import { Middleware, NextHandler } from '@jitar/middleware';

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

    async handle(request: Request, next: NextHandler): Promise<Response>
    {
        const response = await next();

        this.#setHeaders(response);

        return response;
    }

    #setHeaders(response: Response): void
    {
        response.setHeader('Access-Control-Allow-Origin', this.#allowOrigin);
        response.setHeader('Access-Control-Allow-Methods', this.#allowMethods);
        response.setHeader('Access-Control-Allow-Headers', this.#allowHeaders);
    }
}
