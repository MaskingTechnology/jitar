
import RepositoryNotAvailable from '../errors/RepositoryNotAvailable.js';

import File from '../models/File.js';
import Import from '../models/Import.js';
import Module from '../types/Module.js';

import Repository from './Repository.js';

export default class DummyRepository extends Repository
{
    async start(): Promise<void> { }

    async stop(): Promise<void> { }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async readAsset(filename: string): Promise<File>
    {
        throw new RepositoryNotAvailable();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async readModule(importModel: Import): Promise<File>
    {
        throw new RepositoryNotAvailable();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async loadModule(importModel: Import): Promise<Module>
    {
        throw new RepositoryNotAvailable();
    }
}
