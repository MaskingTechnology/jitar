
import Version from '../../../src/models/Version';
import ProcedureRuntime from '../../../src/services/ProcedureRuntime';

class FirstMiddleware
{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async handle(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>, next: () => Promise<unknown>): Promise<unknown>
    {
        headers.set('first', 'yes');
        headers.set('last', '1');

        return '1';
    }
}

class SecondMiddleware
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

class ThirdMiddleware
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

class TestRuntime extends ProcedureRuntime
{
    getProcedureNames(): string[] { return []; }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasProcedure(name: string): boolean { return false; }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async run(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>): Promise<unknown> { return null; }
}

const testRuntime = new TestRuntime();
testRuntime.addMiddleware(new FirstMiddleware());
testRuntime.addMiddleware(new SecondMiddleware());
testRuntime.addMiddleware(new ThirdMiddleware());

export { testRuntime }
