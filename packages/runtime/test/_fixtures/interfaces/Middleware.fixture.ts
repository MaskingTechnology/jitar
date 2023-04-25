
import Version from '../../../src/models/Version';
import Middleware from '../../../src/interfaces/Middleware';

class FirstMiddleware implements Middleware
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>, next: () => Promise<unknown>): Promise<unknown>
    {
        headers.set('first', 'yes');
        headers.set('last', '1');

        return '1';
    }
}

class SecondMiddleware implements Middleware
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>, next: () => Promise<unknown>): Promise<unknown>
    {
        headers.set('second', 'yes');
        headers.set('last', '2');

        const result = await next();

        return result + '2';
    }
}

class ThirdMiddleware implements Middleware
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>, next: () => Promise<unknown>): Promise<unknown>
    {
        headers.set('third', 'yes');
        headers.set('last', '3');

        const result = await next();

        return result + '3';
    }
}

const MIDDLEWARES =
{
    FIRST: new FirstMiddleware(),
    SECOND: new SecondMiddleware(),
    THIRD: new ThirdMiddleware()
};

export { MIDDLEWARES };
