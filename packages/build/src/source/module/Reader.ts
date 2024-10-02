
import { Parser } from '@jitar/analysis';
import type { FileManager } from '@jitar/sourcing';

import FileNotLoaded from './errors/FileNotLoaded';

import Module from './models/Module';
import Repository from './models/Repository';

export default class Reader
{
    #fileManager: FileManager;
    #parser: Parser;

    constructor(fileManager: FileManager, parser: Parser = new Parser())
    {
        this.#fileManager = fileManager;
        this.#parser = parser;
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
        const module = this.#parser.parse(code);

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
