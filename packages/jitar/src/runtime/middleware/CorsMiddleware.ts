
import Middleware from '../interfaces/Middleware.js';
import Version from '../../core/Version.js';
import NextHandler from '../types/NextHandler.js';

export default class CorsMiddleware implements Middleware
{
    #origin: string;
    #methods = ['GET', 'POST'];

    constructor(origin = '*')
    {
        this.#origin = origin;
    }

    async handle(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>, next: NextHandler): Promise<unknown>
    {
        const result = await next();

        this.#setHeaders(headers);

        return result;
    }

    #setHeaders(headers: Map<string, string>): void
    {
        headers.set('Access-Control-Allow-Origin', this.#origin);
        headers.set('Access-Control-Allow-Methods', this.#methods.join(', '));
    }
}
