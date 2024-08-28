
import { Reflector } from '@jitar/reflection';
import type { FileManager } from '@jitar/sourcing';

import FileNotLoaded from './errors/FileNotLoaded';

import Module from './models/Module';
import Repository from './models/Repository';

const reflector = new Reflector();

export default class Reader
{
    #fileManager: FileManager;

    constructor(fileManager: FileManager)
    {
        this.#fileManager = fileManager;
    }

    async readAll(filenames: string[]): Promise<Repository>
    {
        const modules = await Promise.all(filenames.map(filename => this.read(filename)));

        return new Repository(modules);
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

            throw new FileNotLoaded(filename, message);
        }
    }
}
