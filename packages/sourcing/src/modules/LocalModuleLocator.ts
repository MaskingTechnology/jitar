
import FileManager from '../files/FileManager';

import ModuleLocator from './interfaces/ModuleLocator';

export default class LocalModuleLocator implements ModuleLocator
{
    readonly #fileManager: FileManager;

    constructor(fileManager: FileManager)
    {
        this.#fileManager = fileManager;
    }

    locate(filename: string): string
    {
        // If the specifier is an absolute path, we need to convert it to a path
        // relative to the cache folder.
        
        const location = filename.startsWith('/')
            ? this.#fileManager.getAbsoluteLocation(`.${filename}`)
            : this.#fileManager.getAbsoluteLocation(filename);

        return `file://${location}`;
    }
}
