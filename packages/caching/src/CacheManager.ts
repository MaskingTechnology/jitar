
import type { RuntimeConfiguration } from '@jitar/configuration';
import { Files, FileManagerBuilder } from '@jitar/sourcing';
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
        const fileManagerBuilder = new FileManagerBuilder('./');

        this.#projectFileManager = fileManagerBuilder.buildLocal();
        this.#sourceFileManager = fileManagerBuilder.buildLocal(configuration.source);
        this.#targetFileManager = fileManagerBuilder.buildLocal(configuration.target);

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
