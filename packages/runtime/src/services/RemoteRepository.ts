
import File from '../models/File.js';
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

    readModule(source: string, specifier: string): Promise<File>
    {
        return this.#remote.loadFile(`modules/${specifier}?source=${source}`);
    }

    loadModule(specifier: string): Promise<Module>
    {
        return ModuleLoader.load(specifier);
    }

    #getModuleBaseUrl(): string
    {
        return `${this.url}/modules/`;
    }
}
