
import Request from '../../../src/models/Request';
import Middleware from '../../../src/interfaces/Middleware';

class FirstMiddleware implements Middleware
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(request: Request, next: () => Promise<unknown>): Promise<unknown>
    {
        request.setHeader('first', 'yes');
        request.setHeader('last', '1');

        const result = await next();

        return '1' + result;
    }
}

class SecondMiddleware implements Middleware
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(request: Request, next: () => Promise<unknown>): Promise<unknown>
    {
        request.setHeader('second', 'yes');
        request.setHeader('last', '2');

        const result = await next();

        return '2' + result;
    }
}

class ThirdMiddleware implements Middleware
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(request: Request, next: () => Promise<unknown>): Promise<unknown>
    {
        request.setHeader('third', 'yes');
        request.setHeader('last', '3');

        return '3';
    }
}

const MIDDLEWARES =
{
    FIRST: new FirstMiddleware(),
    SECOND: new SecondMiddleware(),
    THIRD: new ThirdMiddleware()
};

export { MIDDLEWARES };
