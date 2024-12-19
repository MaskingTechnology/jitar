
import type { FileManager } from '@jitar/sourcing';

import ResourcesList from './models/ResourcesList';
import FileNotLoaded from './errors/FileNotLoaded';
import type ResourceFile from './types/File';
import { FileHelper } from '../../utils';

export default class ResourceReader
{
    readonly #fileManager: FileManager;
    readonly #fileHelper = new FileHelper();
    
    constructor(fileManager: FileManager)
    {
        this.#fileManager = fileManager;
    }

    async readAll(filenames: string[]): Promise<ResourcesList>
    {
        const resources = await Promise.all(filenames.map(filename => this.#loadResourceDefinition(filename)));

        return new ResourcesList(resources.flat());
    }

    async #loadResourceDefinition(filename: string): Promise<ResourceFile>
    {
        try
        {
            const content = await this.#fileManager.getContent(filename);

            const result = JSON.parse(content.toString()) as ResourceFile;

            return result.map(resource => this.#makeResourceFilename(resource));
        }
        catch (error: unknown)
        {
            const message = error instanceof Error ? error.message : String(error);

            throw new FileNotLoaded(filename, message);
        }
    }

    #makeResourceFilename(filename: string): string
    {
        const fullFilename = this.#fileHelper.assureExtension(filename);

        if (fullFilename.startsWith('./')) return fullFilename.substring(2);
        if (fullFilename.startsWith('/')) return fullFilename.substring(1);

        return fullFilename;
    }
}
