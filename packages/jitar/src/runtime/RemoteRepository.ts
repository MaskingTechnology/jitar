
import Module from '../core/types/Module.js';

import InvalidJitarHooks from './errors/InvalidJitarHooks.js';
import File from './models/File.js';
import Remote from './Remote.js';
import Repository from './Repository.js';
import Runtime from './Runtime.js';
import JitarHooks from './types/JitarHooks.js';
import ModuleLoader from './utils/ModuleLoader.js';

export default class RemoteRepository extends Repository
{
    #remote: Remote;

    constructor(url: string)
    {
        super(url);

        this.#remote = new Remote(url, true);
    }

    async registerClient(segmentFiles: string[]): Promise<string>
    {
        return this.#remote.registerClient(segmentFiles);
    }

    async setRuntime(runtime: Runtime): Promise<void>
    {
        const jitar = await this.#remote.importFile('jitar/hooks.js') as JitarHooks;

        if (jitar?.setRuntime === undefined || jitar?.setDependencyLoader === undefined)
        {
            throw new InvalidJitarHooks();
        }

        jitar.setRuntime(runtime);
        jitar.setDependencyLoader(ModuleLoader.import);
    }

    async loadAsset(filename: string): Promise<File>
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
