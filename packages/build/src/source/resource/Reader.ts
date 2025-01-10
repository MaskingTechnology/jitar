
import type { FileManager } from '@jitar/sourcing';

import { Files } from '../../definitions';
import { FileHelper } from '../../utils';

import ResourcesList from './models/ResourcesList';
import FileNotLoaded from './errors/FileNotLoaded';
import type ResourceFile from './types/File';

export default class ResourceReader
{
    readonly #resourcesFileManager: FileManager;
    readonly #sourceFileManager: FileManager;
    readonly #fileHelper = new FileHelper();
    
    constructor(resourcesFileManager: FileManager, sourceFileManager: FileManager)
    {
        this.#resourcesFileManager = resourcesFileManager;
        this.#sourceFileManager = sourceFileManager;
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
            // The content of the resource file is located in a different folder than the source files.
            // The resource file manager has access to this location, the source file manager does not.

            const content = await this.#resourcesFileManager.getContent(filename);

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
        // For index resolution we need to read the source files and check
        // if the given filename is a directory.

        const fullFilename = this.#sourceFileManager.isDirectory(filename)
            ? `${filename}/${Files.INDEX}`
            : this.#fileHelper.assureExtension(filename);

        if (fullFilename.startsWith('./')) return fullFilename.substring(2);
        if (fullFilename.startsWith('/')) return fullFilename.substring(1);

        return fullFilename;
    }
}
