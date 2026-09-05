
import { Parser } from '@jitar/analysis';
import type { FileManager } from '@jitar/sourcing';

import ReadingModuleFailed from './errors/ReadingModuleFailed';
import Module from './models/Module';
import Repository from './models/Repository';

import LocationRewriter from './LocationRewriter';

export default class Reader
{
    readonly #sourceFileManager: FileManager;
    readonly #parser: Parser;

    readonly #locationRewriter: LocationRewriter;

    constructor(sourceFileManager: FileManager, parser: Parser = new Parser())
    {
        this.#sourceFileManager = sourceFileManager;
        this.#parser = parser;

        this.#locationRewriter = new LocationRewriter(sourceFileManager);
    }

    async readAll(filenames: string[]): Promise<Repository>
    {
        const modules = await Promise.all(filenames.map(filename => this.read(filename)));

        return new Repository(modules);
    }

    async read(filename: string): Promise<Module>
    {
        try
        {
            const relativeLocation = this.#sourceFileManager.getRelativeLocation(filename);
            const code = await this.#loadCode(filename);
            const module = this.#parser.parse(code);

            this.#locationRewriter.rewrite(module, relativeLocation);
            
            return new Module(relativeLocation, module);
        }
        catch (error: unknown)
        {
            throw new ReadingModuleFailed(filename, error);
        }
    }

    async #loadCode(filename: string): Promise<string>
    {
        const content = await this.#sourceFileManager.getContent(filename);

        return content.toString();
    }
}
