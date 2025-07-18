
import { NotImplemented } from '@jitar/errors';
import { File } from '@jitar/sourcing';

import ProviderService from '../ProviderService';
import States from '../common/definitions/States';
import type { State } from '../common/definitions/States';

export default class DummyProvider implements ProviderService
{
    get url(): string
    {
        throw new NotImplemented();
    }

    get state(): State
    {
        return States.AVAILABLE;
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

    async updateState(): Promise<State>
    {
        return States.AVAILABLE;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    provide(filename: string): Promise<File>
    {
        throw new NotImplemented();
    }
}
