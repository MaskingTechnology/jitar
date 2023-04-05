
/*
 * Middleware provides a way to intercept and modify the request and response of a RPC call.
 * It can be used to implement logging, authentication, and other cross-cutting concerns.
 * 
 * Middleware is executed in the reversed order it is registered.
 */

import { Middleware, Version, NextHandler } from 'jitar-runtime';

export default class LoggingMiddleware implements Middleware
{
    async handle(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>, next: NextHandler): Promise<unknown>
    {
        // Modify the request here

        const result = await next();

        // Modify the response (result) here

        console.log(`Logging result for ${fqn} --> ${result}`);

        return result;
    }
}
