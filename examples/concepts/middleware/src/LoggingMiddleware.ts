
/*
 * Middleware provides a way to intercept and modify the request and response of a RPC call.
 * It can be used to implement logging, authentication, and other cross-cutting concerns.
 * 
 * Middleware is executed in the reversed order it is registered.
 */

import { Middleware, Request, Response, NextHandler } from 'jitar';

export default class LoggingMiddleware implements Middleware
{
    async handle(request: Request, next: NextHandler): Promise<Response>
    {
        // Modify the request here (e.g. add a header)

        const result = await next();

        // Modify the response (result) here

        console.log(`Logging result for ${request.fqn} --> ${result}`);

        return result;
    }
}
