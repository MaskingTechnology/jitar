
import type { FileManager } from '@jitar/sourcing';

export default class ProjectFileManager
{
    readonly #sourceFileManager: FileManager;
    readonly #targetFileManager: FileManager;
    readonly #resourcesFileManager: FileManager;
    readonly #segmentsFileManager: FileManager;

    constructor(sourceFileManager: FileManager, targetFileManager: FileManager, resourcesFileManager: FileManager, segmentsFileManager: FileManager)
    {
        this.#sourceFileManager = sourceFileManager;
        this.#targetFileManager = targetFileManager;
        this.#resourcesFileManager = resourcesFileManager;
        this.#segmentsFileManager = segmentsFileManager;
    }

    get sourceFileManager() { return this.#sourceFileManager; }

    get targetFileManager() { return this.#targetFileManager; }

    get resourcesFileManager() { return this.#resourcesFileManager; }

    get segmentsFileManager() { return this.#segmentsFileManager; }
}
