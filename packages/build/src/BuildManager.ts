
import type { RuntimeConfiguration } from '@jitar/configuration';
import { Logger, LogLevel } from '@jitar/logging';
import { Files, FileManager } from '@jitar/sourcing';

import { ApplicationReader } from './source';
import { ApplicationBuilder } from './target';
import ProjectFileManager from './ProjectFileManager';

export default class BuildManager
{
    readonly #logger: Logger;

    readonly #projectFileManager: ProjectFileManager;

    readonly #applicationReader: ApplicationReader;
    readonly #applicationBuilder: ApplicationBuilder;

    constructor(configuration: RuntimeConfiguration, logLevel?: LogLevel)
    {
        this.#logger = new Logger(logLevel);

        const sourceFileManager = new FileManager(configuration.source);
        const targetFileManager = new FileManager(configuration.target);
        const resourcesFileManager = new FileManager(configuration.resources);
        const segmentsFileManager = new FileManager(configuration.segments);

        this.#projectFileManager = new ProjectFileManager( sourceFileManager, targetFileManager, resourcesFileManager, segmentsFileManager);

        this.#applicationReader = new ApplicationReader(this.#projectFileManager);
        this.#applicationBuilder = new ApplicationBuilder(this.#projectFileManager, this.#logger);
    }

    async build(): Promise<void>
    {
        const sourceFileManager = this.#projectFileManager.sourceFileManager;
        const resourcesFileManager = this.#projectFileManager.resourcesFileManager;
        const segmentsFileManager = this.#projectFileManager.segmentsFileManager;

        const moduleFiles = await sourceFileManager.filter(Files.MODULE_PATTERN);
        const resourceFiles = await resourcesFileManager.filter(Files.RESOURCES_PATTERN);
        const segmentFiles = await segmentsFileManager.filter(Files.SEGMENT_PATTERN);

        const applicationModel = await this.#applicationReader.read(moduleFiles, resourceFiles, segmentFiles);

        return this.#applicationBuilder.build(applicationModel);
    }
}
