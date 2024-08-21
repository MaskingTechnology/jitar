
import ModuleNotLoaded from './errors/ModuleNotLoaded';
import FileManager from './interfaces/FileManager';
import File from './models/File';
import Module from './types/Module';
import ImportFunction from './types/ImportFunction';

export default class SourceManager
{
    #import: ImportFunction;
    #fileManager: FileManager;

    constructor(moduleImporter: ImportFunction, fileManager: FileManager)
    {
        this.#import = moduleImporter;
        this.#fileManager = fileManager;
    }

    async import(specifier: string): Promise<Module>
    {
        try
        {
            const fullSpecifier = specifier.startsWith('/')
                ? this.#fileManager.getAbsoluteLocation(specifier)
                : specifier;

            return await this.#import(fullSpecifier);
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            throw new ModuleNotLoaded(specifier, message);
        }
    }

    async read(filename: string): Promise<File>
    {
        return this.#fileManager.read(filename);
    }
}
