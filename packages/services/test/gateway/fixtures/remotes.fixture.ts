
import { Request, Response, StatusCodes } from '@jitar/execution';
import { File } from '@jitar/sourcing';

import Remote from '../../../src/Remote';

class DummyRemote implements Remote
{
    connect(): Promise<void>
    {
        throw new Error('Method not implemented.');
    }

    disconnect(): Promise<void>
    {
        throw new Error('Method not implemented.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    provide(filename: string): Promise<File>
    {
        throw new Error('Method not implemented.');
    }

    isHealthy(): Promise<boolean>
    {
        throw new Error('Method not implemented.');
    }

    getHealth(): Promise<Map<string, boolean>>
    {
        throw new Error('Method not implemented.');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addWorker(workerUrl: string, procedureNames: string[], trustKey?: string): Promise<void>
    {
        throw new Error('Method not implemented.');
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
