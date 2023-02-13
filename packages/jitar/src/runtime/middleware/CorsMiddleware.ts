
import Middleware from '../interfaces/Middleware.js';
import Version from '../../core/Version.js';
import NextHandler from '../types/NextHandler.js';

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
