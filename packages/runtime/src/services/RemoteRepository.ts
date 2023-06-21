
import File from '../models/File.js';
import Module from '../types/Module.js';

import Remote from './Remote.js';
import Repository from './Repository.js';

export default class RemoteRepository extends Repository
{
    #remote: Remote;

    constructor(url: string)
    {
        super(url);

        this.#remote = new Remote(url);
    }

    registerClient(segmentFiles: string[]): Promise<string>
    {
        return this.#remote.registerClient(segmentFiles);
    }

    loadAsset(filename: string): Promise<File>
    {
        return this.#remote.loadFile(filename);
    }

    async getModuleLocation(clientId: string): Promise<string>
    {
        return `${this.url}/modules/${clientId}`;
    }

    async loadModule(clientId: string, filename: string): Promise<File>
    {
        return this.#remote.loadFile(`modules/${clientId}/${filename}`);
    }

    async importModule(clientId: string, filename: string): Promise<Module>
    {
        return this.#remote.importFile(`modules/${clientId}/${filename}`);
    }
}
