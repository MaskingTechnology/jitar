
import type { RuntimeConfiguration } from '@jitar/configuration';
import { Files, LocalFileManager } from '@jitar/sourcing';

import { Application, ApplicationReader } from './source';
import { LocalModuleGenerator, RemoteModuleGenerator } from './target';
import { FileHelper } from './utils';

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

        const sourceFileManager = new LocalFileManager(source);
        const targetFileManager = new LocalFileManager(target);
        const resourceFileManager = new LocalFileManager(resources);
        const segmentFileManager = new LocalFileManager(segments);

        this.#fileManager = new ProjectFileManager(sourceFileManager, targetFileManager, resourceFileManager, segmentFileManager);

        this.#applicationReader = new ApplicationReader(this.#fileManager);
    }

    async readApplication(): Promise<void>
    {
        const sourceFileManager = this.#fileManager.source;
        const resourceFileManager = this.#fileManager.resource;
        const segmentFileManager = this.#fileManager.segment;

        const moduleFiles = await sourceFileManager.filter(Files.MODULE_PATTERN);
        const resourceFiles = await resourceFileManager.filter(Files.RESOURCE_PATTERN);
        const segmentFiles = await segmentFileManager.filter(Files.SEGMENT_PATTERN);

        this.#application = await this.#applicationReader.read(moduleFiles, resourceFiles, segmentFiles);
    }

    generateModuleCode(filename: string, segmentNames: string[] = []): string
    {
        if (this.#application === undefined)
        {
            throw new Error('Application not read');
        }

        const repository = this.#application.repository;

        const module = repository.get(filename);

        if (module === undefined)
        {
            throw new Error(`Module not found: ${filename}`);
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
