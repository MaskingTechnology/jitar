
import File from '../models/File.js';
import Module from '../types/Module.js';
import ModuleLoader from '../utils/ModuleLoader.js';
import { setRuntime, setDependencyLoader } from '../hooks.js';

import Remote from './Remote.js';
import Repository from './Repository.js';
import LocalNode from './LocalNode.js';

export default class RemoteRepository extends Repository
{
    #remote: Remote;

    constructor(url: string)
    {
        super(url);

        this.#remote = new Remote(url, true);
    }

    registerClient(segmentFiles: string[]): Promise<string>
    {
        return this.#remote.registerClient(segmentFiles);
    }

    async setRuntime(runtime: LocalNode): Promise<void>
    {
        setRuntime(runtime);
        setDependencyLoader(ModuleLoader.import);
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
