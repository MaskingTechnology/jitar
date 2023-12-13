
import RepositoryNotAvailable from '../errors/RepositoryNotAvailable.js';

import File from '../models/File.js';
import Module from '../types/Module.js';

import Repository from './Repository.js';

export default class DummyRepository extends Repository
{
    async start(): Promise<void> { }

    async stop(): Promise<void> { }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async registerClient(segmentFiles: string[]): Promise<string>
    {
        throw new RepositoryNotAvailable();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async readAsset(filename: string): Promise<File>
    {
        throw new RepositoryNotAvailable();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async readModule(filename: string, clientId: string): Promise<File>
    {
        throw new RepositoryNotAvailable();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async loadModule(filename: string): Promise<Module>
    {
        throw new RepositoryNotAvailable();
    }
}
