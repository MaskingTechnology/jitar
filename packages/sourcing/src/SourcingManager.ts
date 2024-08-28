
import { File, FileManager } from './files';
import { Module, ImportFunction, ModuleNotLoaded } from './modules';

export default class SourceManager
{
    #import: ImportFunction;
    #fileManager: FileManager;

    constructor(importFunction: ImportFunction, fileManager: FileManager)
    {
        this.#import = importFunction;
        this.#fileManager = fileManager;
    }

    async import(specifier: string): Promise<Module>
    {
        try
        {
            // If the specifier is an absolute path, we need to convert it to a path
            // relative to the cache folder.
            
            const fullSpecifier = specifier.startsWith('/')
                ? this.#fileManager.getAbsoluteLocation(`.${specifier}`)
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
