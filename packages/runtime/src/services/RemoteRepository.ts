
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
        const clientId = await this.registerClient(this.segmentNames);
        const baseUrl = this.#getModuleBaseUrl(clientId);
        
        ModuleLoader.setBaseUrl(baseUrl);

        await super.start();
    }

    registerClient(segmentFiles: string[]): Promise<string>
    {
        return this.#remote.registerClient(segmentFiles);
    }

    readAsset(filename: string): Promise<File>
    {
        return this.#remote.loadFile(filename);
    }

    readModule(filename: string, clientId: string): Promise<File>
    {
        return this.#remote.loadFile(`modules/${clientId}/${filename}`);
    }

    loadModule(filename: string): Promise<Module>
    {
        return ModuleLoader.load(filename);
    }

    #getModuleBaseUrl(clientId: string): string
    {
        return `${this.url}/modules/${clientId}`;
    }
}
