
import File from '../models/File.js';
import Import from '../models/Import.js';
import Module from '../types/Module.js';
import ModuleLoader from '../utils/ModuleLoader.js';

import Remote from './Remote.js';
import Repository from './Repository.js';

export default class RemoteRepository extends Repository
{
    #remote: Remote;
    #segmentNames: Set<string> = new Set();
    
    constructor(url: string)
    {
        super(url);

        this.#remote = new Remote(url);
    }

    get segmentNames(): string[] { return [...this.#segmentNames.values()]; }

    set segmentNames(segmentNames: Set<string>) { this.#segmentNames = segmentNames; }

    async start(): Promise<void>
    {
        const baseUrl = this.#getModuleBaseUrl();
        
        ModuleLoader.setBaseUrl(baseUrl);

        await super.start();
    }

    readAsset(filename: string): Promise<File>
    {
        return this.#remote.loadFile(filename);
    }

    readModule(importModel: Import): Promise<File>
    {
        console.log('RemoteRepository.readModule', importModel.specifier, importModel.caller);
        return this.#remote.loadFile(`modules/${importModel.specifier}?caller=${importModel.caller}`);
    }

    loadModule(importModel: Import): Promise<Module>
    {
        return ModuleLoader.load(importModel);
    }

    #getModuleBaseUrl(): string
    {
        return `${this.url}/modules/`;
    }
}
