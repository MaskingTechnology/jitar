
import type { FileManager } from '@jitar/sourcing';

const filename = 'jitar.js';
const code = `export default async (specifier) => import(specifier);`;

export default class JitarBuilder
{
    #fileManager: FileManager;

    constructor(fileManager: FileManager)
    {
        this.#fileManager = fileManager;
    }

    build(): Promise<void>
    {
        return this.#fileManager.write(filename, code);
    }
}
