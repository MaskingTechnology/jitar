
import { Reflector } from 'jitar-reflection';
import { FileManager } from 'jitar-runtime';

import ModuleFileNotLoaded from './errors/ModuleFileNotLoaded.js';

import Module from './models/Module.js';

const reflector = new Reflector();

export default class ModuleReader
{
    #fileManager: FileManager;

    constructor(fileManager: FileManager)
    {
        this.#fileManager = fileManager;
    }

    async read(filename: string): Promise<Module>
    {
        const relativeLocation = this.#fileManager.getRelativeLocation(filename);
        const code = await this.#loadCode(filename);
        const module = reflector.parse(code);

        return new Module(relativeLocation, code, module);
    }

    async #loadCode(filename: string): Promise<string>
    {
        try
        {
            const content = await this.#fileManager.getContent(filename);

            return content.toString();
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            throw new ModuleFileNotLoaded(filename, message);
        }
    }
}
