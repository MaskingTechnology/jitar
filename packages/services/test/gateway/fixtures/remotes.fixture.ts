
import { NotImplemented } from '@jitar/errors';
import { Request, Response, StatusCodes } from '@jitar/execution';
import { File } from '@jitar/sourcing';

import Remote from '../../../src/Remote';

class DummyRemote implements Remote
{
    connect(): Promise<void>
    {
        throw new NotImplemented();
    }

    disconnect(): Promise<void>
    {
        throw new NotImplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    provide(filename: string): Promise<File>
    {
        throw new NotImplemented();
    }

    isHealthy(): Promise<boolean>
    {
        throw new NotImplemented();
    }

    getHealth(): Promise<Map<string, boolean>>
    {
        throw new NotImplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addWorker(workerUrl: string, procedureNames: string[], trustKey?: string): Promise<void>
    {
        throw new NotImplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async run(request: Request): Promise<Response>
    {
        return new Response(StatusCodes.OK, 'test');
    }
}

export const REMOTES =
{
    DUMMY: new DummyRemote()
};
