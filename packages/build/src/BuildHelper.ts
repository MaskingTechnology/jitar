
import type { RuntimeConfiguration } from '@jitar/configuration';
import { Files, LocalFileManager } from '@jitar/sourcing';

import { Application, ApplicationReader } from './source';
import { LocalModuleGenerator, RemoteModuleGenerator } from './target';
import { FileHelper } from './utils';

import ApplicationNotRead from './errors/ApplicationNotRead';
import ApplicationModuleNotFound from './errors/ApplicationModuleNotFound';

import ProjectFileManager from './ProjectFileManager';

export default class BuildHelper
{
    readonly #fileHelper: FileHelper = new FileHelper();
    readonly #fileManager: ProjectFileManager;
    readonly #applicationReader: ApplicationReader;

    #application?: Application;

    constructor(configuration: RuntimeConfiguration)
    {
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
    }

    async readApplication(): Promise<void>
    {
        const sourceFileManager = this.#fileManager.source;
        const resourceFileManager = this.#fileManager.resource;
        const segmentFileManager = this.#fileManager.segment;

        const moduleFiles = await sourceFileManager.filterWithIgnores(Files.MODULE_PATTERN, this.#fileManager.sourceIgnores);
        const resourceFiles = await resourceFileManager.filter(Files.RESOURCE_PATTERN);
        const segmentFiles = await segmentFileManager.filter(Files.SEGMENT_PATTERN);

        this.#application = await this.#applicationReader.read(moduleFiles, resourceFiles, segmentFiles);
    }

    generateModuleCode(filename: string, segmentNames: string[] = []): string
    {
        if (this.#application === undefined)
        {
            throw new ApplicationNotRead();
        }

        const repository = this.#application.repository;

        const module = repository.get(filename);

        if (module === undefined)
        {
            throw new ApplicationModuleNotFound(filename);
        }

        const resources = this.#application.resources;
        const segmentation = this.#application.segmentation;

        const segments = segmentation.getSegments(filename);

        if (segments.length === 0)
        {
            const generator = new LocalModuleGenerator(module, resources, segmentation);

            return generator.generate();
        }

        const segment = segments.find(segment => segmentNames.includes(segment.name));

        if (segment === undefined)
        {
            const generator = new RemoteModuleGenerator(module, segments);
            
            return generator.generate();
        }

        const generator = new LocalModuleGenerator(module, resources, segmentation);
            
        return generator.generate();
    }
}
