
import { NotImplemented } from '@jitar/errors';
import { File } from '@jitar/sourcing';

import ProviderService from '../ProviderService';

export default class DummyProvider implements ProviderService
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    provide(filename: string): Promise<File>
    {
        throw new NotImplemented();
    }
}
