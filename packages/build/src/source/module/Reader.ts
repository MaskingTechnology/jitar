
import { Parser } from '@jitar/analysis';
import type { FileManager } from '@jitar/sourcing';

import FileNotLoaded from './errors/FileNotLoaded';

import Module from './models/Module';
import Repository from './models/Repository';
import LocationRewriter from './LocationRewriter';

export default class Reader
{
    readonly #fileManager: FileManager;
    readonly #parser: Parser;

    readonly #locationRewriter: LocationRewriter;

    constructor(fileManager: FileManager, parser: Parser = new Parser())
    {
        this.#fileManager = fileManager;
        this.#parser = parser;

        this.#locationRewriter = new LocationRewriter(fileManager);
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
        const rewrittenCode = this.#locationRewriter.rewrite(relativeLocation, code);
        const module = this.#parser.parse(rewrittenCode);

        return new Module(relativeLocation, rewrittenCode, module);
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
