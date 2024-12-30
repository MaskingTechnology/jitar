
import type { RuntimeConfiguration } from '@jitar/configuration';
import { Logger, LogLevel } from '@jitar/logging';
import { Files, FileManager } from '@jitar/sourcing';

import { ApplicationReader } from './source';
import { ApplicationBuilder } from './target';

export default class BuildManager
{
    readonly #logger: Logger;

    readonly #projectFileManager: FileManager;
    readonly #sourceFileManager: FileManager;
    readonly #targetFileManager: FileManager;

    readonly #applicationReader: ApplicationReader;
    readonly #applicationBuilder: ApplicationBuilder;

    constructor(configuration: RuntimeConfiguration, logLevel?: LogLevel)
    {
        this.#logger = new Logger(logLevel);

        this.#projectFileManager = new FileManager('./');
        this.#sourceFileManager = new FileManager(configuration.source);
        this.#targetFileManager = new FileManager(configuration.target);

        this.#applicationReader = new ApplicationReader(this.#sourceFileManager);
        this.#applicationBuilder = new ApplicationBuilder(this.#targetFileManager, this.#logger);
    }

    async build(): Promise<void>
    {
        const moduleFiles = await this.#sourceFileManager.filter(Files.MODULE_PATTERN);
        const resourceFiles = await this.#projectFileManager.filter(Files.RESOURCES_PATTERN);
        const segmentFiles = await this.#projectFileManager.filter(Files.SEGMENT_PATTERN);

        const applicationModel = await this.#applicationReader.read(moduleFiles, resourceFiles, segmentFiles);

        return this.#applicationBuilder.build(applicationModel);
    }
}
