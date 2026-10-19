
import type { RuntimeConfiguration } from '@jitar/configuration';
import { Logger, LogLevel } from '@jitar/logging';
import { Files, LocalFileManager } from '@jitar/sourcing';

import { ApplicationReader } from './source';
import { ApplicationBuilder } from './target';
import { FileHelper } from './utils';

import BuildFailed from './errors/BuildFailed';

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

        this.#fileManager = new ProjectFileManager(
            new LocalFileManager(configuration.source, configuration.meta.root),
            new LocalFileManager(configuration.target, configuration.meta.root),
            new LocalFileManager(configuration.resources, configuration.meta.root),
            new LocalFileManager(configuration.segments, configuration.meta.root),
            configuration.build.ignore
        );

        this.#applicationReader = new ApplicationReader(this.#fileManager);
        this.#applicationBuilder = new ApplicationBuilder(this.#fileManager, this.#logger);
    }

    async build(): Promise<void>
    {
        try
        {
            const sourceFileManager = this.#fileManager.source;
            const resourceFileManager = this.#fileManager.resource;
            const segmentFileManager = this.#fileManager.segment;

            const moduleFiles = await sourceFileManager.filterWithIgnores(Files.MODULE_PATTERN, this.#fileManager.sourceIgnores);
            const resourceFiles = await resourceFileManager.filter(Files.RESOURCE_PATTERN);
            const segmentFiles = await segmentFileManager.filter(Files.SEGMENT_PATTERN);

            const applicationModel = await this.#applicationReader.read(moduleFiles, resourceFiles, segmentFiles);

            await this.#applicationBuilder.build(applicationModel);
        }
        catch (error: unknown)
        {
            throw new BuildFailed(error);
        }
    }
}
