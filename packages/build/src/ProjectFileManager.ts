
import type { FileManager } from '@jitar/sourcing';

export default class ProjectFileManager
{
    readonly #source: FileManager;
    readonly #target: FileManager;
    readonly #resource: FileManager;
    readonly #segment: FileManager;
    readonly #sourceIgnores: string[];

    constructor(source: FileManager, target: FileManager, resource: FileManager, segment: FileManager, sourceIgnores: string[])
    {
        this.#source = source;
        this.#target = target;
        this.#resource = resource;
        this.#segment = segment;
        this.#sourceIgnores = sourceIgnores;
    }

    get source() { return this.#source; }

    get target() { return this.#target; }

    get resource() { return this.#resource; }

    get segment() { return this.#segment; }

    get sourceIgnores() { return this.#sourceIgnores; }
}
