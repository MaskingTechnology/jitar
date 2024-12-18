
import type { FileManager } from '@jitar/sourcing';

import ResourceList from './models/ResourceList';
import FileNotLoaded from './errors/FileNotLoaded';

export default class ResourceReader
{
    readonly #fileManager: FileManager;

    constructor(fileManager: FileManager)
    {
        this.#fileManager = fileManager;
    }

    async readAll(filenames: string[]): Promise<ResourceList>
    {
        const resources = await Promise.all(filenames.map(filename => this.#loadResourceDefinition(filename)));

        return new ResourceList(resources.flat());
    }

    async #loadResourceDefinition(filename: string): Promise<string[]>
    {
        try
        {
            const content = await this.#fileManager.getContent(filename);

            const result = JSON.parse(content.toString()) as string[];

            return result;
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            throw new FileNotLoaded(filename, message);
        }
    }
}
