
import type { RuntimeConfiguration } from '@jitar/configuration';
import { Logger, LogLevel } from '@jitar/logging';
import { Files, LocalFileManager } from '@jitar/sourcing';

import { ApplicationReader } from './source';
import { ApplicationBuilder } from './target';
import { FileHelper } from './utils';

import ProjectFileManager from './ProjectFileManager';

export default class BuildManager
{
    readonly #logger: Logger;
    readonly #fileHelper: FileHelper;

    readonly #fileManager: ProjectFileManager;

    readonly #applicationReader: ApplicationReader;
    readonly #applicationBuilder: ApplicationBuilder;

    constructor(configuration: RuntimeConfiguration, logLevel?: LogLevel)
    {
        this.#logger = new Logger(logLevel);
        this.#fileHelper = new FileHelper();

        const source = this.#fileHelper.makePathAbsolute(configuration.source, configuration.meta.root);
        const target = this.#fileHelper.makePathAbsolute(configuration.target, configuration.meta.root);
        const resources = this.#fileHelper.makePathAbsolute(configuration.resources, configuration.meta.root);
        const segments = this.#fileHelper.makePathAbsolute(configuration.segments, configuration.meta.root);

        this.#fileManager = new ProjectFileManager(
            new LocalFileManager(source),
            new LocalFileManager(target),
            new LocalFileManager(resources),
            new LocalFileManager(segments),
            configuration.build.ignore
        );

        this.#applicationReader = new ApplicationReader(this.#fileManager);
        this.#applicationBuilder = new ApplicationBuilder(this.#fileManager, this.#logger);
    }

    async build(): Promise<void>
    {
        const sourceFileManager = this.#fileManager.source;
        const resourceFileManager = this.#fileManager.resource;
        const segmentFileManager = this.#fileManager.segment;

        const moduleFiles = await sourceFileManager.filterWithIgnores(Files.MODULE_PATTERN, this.#fileManager.sourceIgnores);
        const resourceFiles = await resourceFileManager.filter(Files.RESOURCE_PATTERN);
        const segmentFiles = await segmentFileManager.filter(Files.SEGMENT_PATTERN);

        const applicationModel = await this.#applicationReader.read(moduleFiles, resourceFiles, segmentFiles);

        return this.#applicationBuilder.build(applicationModel);
    }
}
