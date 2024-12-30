
import type File from './models/File';
import ModuleNotLoaded from './errors/ModuleNotLoaded';
import type Module from './types/Module';
import type FileManager from './FileManager';

export default class SourcingManager
{
    readonly #fileManager: FileManager;

    constructor(fileManager: FileManager)
    {
        this.#fileManager = fileManager;
    }

    async filter(...patterns: string[]): Promise<string[]>
    {
        const files = await Promise.all(patterns.map(pattern => this.#fileManager.filter(pattern)));

        return files.flat().map(file => this.#fileManager.getRelativeLocation(file));
    }

    async exists(filename: string): Promise<boolean>
    {
        return this.#fileManager.exists(filename);
    }

    async read(filename: string): Promise<File>
    {
        return this.#fileManager.read(filename);
    }

    async import(filename: string): Promise<Module>
    {
        // If the specifier is an absolute path, we need to convert it to a path
        // relative to the cache folder.
        
        const specifier = filename.startsWith('/')
            ? this.#fileManager.getAbsoluteLocation(`.${filename}`)
            : this.#fileManager.getAbsoluteLocation(filename);
        
        try
        {
            return await import(specifier);
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            throw new ModuleNotLoaded(specifier, message);
        }
    }
}
