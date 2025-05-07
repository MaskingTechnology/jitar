

import { File, FileManager, FileReader } from './files';
import { Module, ImportManager, ModuleImporter } from './modules';

export default class SourcingManager implements FileReader, ModuleImporter
{
    readonly #fileManager: FileManager;
    readonly #importManager: ImportManager;

    constructor(fileManager: FileManager, importManager: ImportManager)
    {
        this.#fileManager = fileManager;
        this.#importManager = importManager;
    }

    async filter(...patterns: string[]): Promise<string[]>
    {
        const files = await Promise.all(patterns.map(pattern => this.#fileManager.filter(pattern)));

        return files.flat().map(file => this.#fileManager.getRelativeLocation(file));
    }

    exists(filename: string): Promise<boolean>
    {
        return this.#fileManager.exists(filename);
    }

    read(filename: string): Promise<File>
    {
        return this.#fileManager.read(filename);
    }

    import(filename: string): Promise<Module>
    {
        return this.#importManager.import(filename);
    }
}
