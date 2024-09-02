
import { NotImplemented } from '@jitar/errors';
import { Request, Response } from '@jitar/execution';

import RunnerService from '../RunnerService';

export default class DummyRunner implements RunnerService
{
    get url(): string
    {
        throw new NotImplemented();
    }

    start(): Promise<void>
    {
        return Promise.resolve();
    }

    stop(): Promise<void>
    {
        return Promise.resolve();
    }

    async isHealthy(): Promise<boolean>
    {
        return true;
    }

    async getHealth(): Promise<Map<string, boolean>>
    {
        return new Map();
    }

    getProcedureNames(): string[]
    {
        throw new NotImplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasProcedure(name: string): boolean
    {
        throw new NotImplemented();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    run(request: Request): Promise<Response>
    {
        throw new NotImplemented();
    }
}
