
import { File, FileManager } from './files';
import { Module, ImportFunction, ModuleNotLoaded } from './modules';

export default class SourceManager
{
    #fileManager: FileManager;
    #import: ImportFunction;

    constructor(fileManager: FileManager, importFunction: ImportFunction)
    {
        this.#fileManager = fileManager;
        this.#import = importFunction;
    }

    async read(filename: string): Promise<File>
    {
        return this.#fileManager.read(filename);
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
}
