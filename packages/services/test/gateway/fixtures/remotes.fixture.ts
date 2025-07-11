
import { NotImplemented } from '@jitar/errors';
import { Request, Response, StatusCodes } from '@jitar/execution';
import { File } from '@jitar/sourcing';

import Remote from '../../../src/common/Remote';
import { State } from '../../../src/common/definitions/States';

class DummyRemote implements Remote
{
    connect(): Promise<void>
    {
        return Promise.resolve();
    }

    disconnect(): Promise<void>
    {
        return Promise.resolve();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    provide(filename: string): Promise<File>
    {
        throw new NotImplemented();
    }

    isHealthy(): Promise<boolean>
    {
        return Promise.resolve(true);
    }

    getHealth(): Promise<Map<string, boolean>>
    {
        return Promise.resolve(new Map());
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    addWorker(workerUrl: string, procedureNames: string[], trustKey?: string): Promise<string>
    {
        return Promise.resolve('1234');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reportWorker(id: string, state: State): Promise<void>
    {
        return Promise.resolve();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeWorker(workerUrl: string, trustKey?: string): Promise<void>
    {
        return Promise.resolve();  
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
