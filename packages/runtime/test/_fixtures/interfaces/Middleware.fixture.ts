
import Request from '../../../src/models/Request';
import Response from '../../../src/models/Response';
import Middleware from '../../../src/interfaces/Middleware';

class FirstMiddleware implements Middleware
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(request: Request, next: () => Promise<Response>): Promise<Response>
    {
        request.setHeader('third', 'yes');
        request.setHeader('last', '3');

        return new Response('3');
    }
}

const MIDDLEWARES =
{
    FIRST: new FirstMiddleware(),
    SECOND: new SecondMiddleware(),
    THIRD: new ThirdMiddleware()
};

export { MIDDLEWARES };
