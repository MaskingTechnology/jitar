
import type { RuntimeConfiguration } from '@jitar/configuration';
import { Files, LocalFileManager } from '@jitar/sourcing';
import type { FileManager } from '@jitar/sourcing';

import { ApplicationReader } from './source';
import { ApplicationBuilder } from './target';

export default class CacheManager
{
    #projectFileManager: FileManager;
    #sourceFileManager: FileManager;
    #targetFileManager: FileManager;

    #applicationReader: ApplicationReader;
    #applicationBuilder: ApplicationBuilder;

    constructor(configuration: RuntimeConfiguration)
    {
        this.#projectFileManager = new LocalFileManager('./');
        this.#sourceFileManager = new LocalFileManager(configuration.source);
        this.#targetFileManager = new LocalFileManager(configuration.target);

        this.#applicationReader = new ApplicationReader(this.#sourceFileManager);
        this.#applicationBuilder = new ApplicationBuilder(this.#targetFileManager);
    }

    async build(): Promise<void>
    {
        const moduleFiles = await this.#sourceFileManager.filter(Files.MODULE_PATTERN);
        const segmentFiles = await this.#projectFileManager.filter(Files.SEGMENT_PATTERN);

        const applicationModel = await this.#applicationReader.read(moduleFiles, segmentFiles);

        return this.#applicationBuilder.build(applicationModel);
    }
}
