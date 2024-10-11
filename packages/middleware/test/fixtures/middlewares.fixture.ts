
import { Request, Response, StatusCodes } from '@jitar/execution';

import Middleware from '../../src/interfaces/Middleware';

class FirstMiddleware implements Middleware
{
    async handle(request: Request, next: () => Promise<Response>): Promise<Response>
    {
        request.setHeader('first', 'yes');
        request.setHeader('last', '1');

        const response = await next();
        response.result = '1' + response.result;

        return response;
    }
}

class SecondMiddleware implements Middleware
{
    async handle(request: Request, next: () => Promise<Response>): Promise<Response>
    {
        request.setHeader('second', 'yes');
        request.setHeader('last', '2');

        const response = await next();
        response.result = '2' + response.result;

        return response;
    }
}

class ThirdMiddleware implements Middleware
{
    async handle(request: Request, next: () => Promise<Response>): Promise<Response>
    {
        request.setHeader('third', 'yes');
        request.setHeader('last', '3');

        return new Response(StatusCodes.OK, '3');
    }
}

export const MIDDLEWARES =
{
    FIRST: new FirstMiddleware(),
    SECOND: new SecondMiddleware(),
    THIRD: new ThirdMiddleware()
};
