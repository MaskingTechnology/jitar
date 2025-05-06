
import type { RuntimeConfiguration } from '@jitar/configuration';
import { Logger, LogLevel } from '@jitar/logging';
import { Files, LocalFileManager } from '@jitar/sourcing';

import { ApplicationReader } from './source';
import { ApplicationBuilder } from './target';
import ProjectFileManager from './ProjectFileManager';

export default class BuildManager
{
    readonly #logger: Logger;

    readonly #fileManager: ProjectFileManager;

    readonly #applicationReader: ApplicationReader;
    readonly #applicationBuilder: ApplicationBuilder;

    constructor(configuration: RuntimeConfiguration, logLevel?: LogLevel)
    {
        this.#logger = new Logger(logLevel);

        const sourceFileManager = new LocalFileManager(configuration.source);
        const targetFileManager = new LocalFileManager(configuration.target);
        const resourceFileManager = new LocalFileManager(configuration.resources);
        const segmentFileManager = new LocalFileManager(configuration.segments);

        this.#fileManager = new ProjectFileManager(sourceFileManager, targetFileManager, resourceFileManager, segmentFileManager);

        this.#applicationReader = new ApplicationReader(this.#fileManager);
        this.#applicationBuilder = new ApplicationBuilder(this.#fileManager, this.#logger);
    }

    async build(): Promise<void>
    {
        const sourceFileManager = this.#fileManager.source;
        const resourceFileManager = this.#fileManager.resource;
        const segmentFileManager = this.#fileManager.segment;

        const moduleFiles = await sourceFileManager.filter(Files.MODULE_PATTERN);
        const resourceFiles = await resourceFileManager.filter(Files.RESOURCE_PATTERN);
        const segmentFiles = await segmentFileManager.filter(Files.SEGMENT_PATTERN);

        const applicationModel = await this.#applicationReader.read(moduleFiles, resourceFiles, segmentFiles);

        return this.#applicationBuilder.build(applicationModel);
    }
}
