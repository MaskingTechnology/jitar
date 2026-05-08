
import type { FileManager } from '@jitar/sourcing';

import type { Application, Module, Segment, Segmentation, ResourcesList } from '../../source';
import { FileHelper } from '../../utils';

import LocalGenerator from './LocalGenerator';
import RemoteGenerator from './RemoteGenerator';

export default class Builder
{
    readonly #targetFileManager: FileManager;
    readonly #fileHelper = new FileHelper();

    constructor(targetFileManager: FileManager)
    {
        this.#targetFileManager = targetFileManager;
    }

    async build(application: Application): Promise<void>
    {
        const repository = application.repository;
        const segmentation = application.segmentation;
        const resources = application.resources;

        const builds = repository.modules.map(module => this.#buildModule(module, resources, segmentation));

        await Promise.all(builds);
    }

    async #buildModule(module: Module, resources: ResourcesList, segmentation: Segmentation): Promise<void>
    {
        const moduleSegments = segmentation.getSegments(module.filename);

        if (moduleSegments.length === 0)
        {
            // For unsegmented modules we only need to build the common module.
            // This will overwrite the original module file.

            return this.#buildCommonModule(module, resources, segmentation);
        }
        
        const segmentBuilds = moduleSegments.map(segment => this.#buildSegmentModule(module, resources, segment, segmentation));

        const firstModuleSegment = moduleSegments[0];
        const segmentModule = firstModuleSegment.getModule(module.filename);

        const remoteBuild = segmentModule?.hasImplementations()
            ? this.#buildRemoteModule(module, moduleSegments)
            : Promise.resolve();

        await Promise.all([...segmentBuilds, remoteBuild]);

        // The segment files will replace the original module file, so we can delete it.

        this.#targetFileManager.delete(module.filename);
    }

    async #buildCommonModule(module: Module, resources: ResourcesList, segmentation: Segmentation): Promise<void>
    {
        const filename = module.filename;

        const generator = new LocalGenerator(module, resources, segmentation);
        const code = generator.generate();

        return this.#targetFileManager.write(filename, code);
    }

    async #buildSegmentModule(module: Module, resources: ResourcesList, segment: Segment, segmentation: Segmentation): Promise<void>
    {
        const filename = this.#fileHelper.addSubExtension(module.filename, segment.name);

        const generator = new LocalGenerator(module, resources, segmentation);
        const code = generator.generate();

        return this.#targetFileManager.write(filename, code);
    }

    async #buildRemoteModule(module: Module, segments: Segment[]): Promise<void>
    {
        // The remote module contains calls to segmented procedures only

        const filename = this.#fileHelper.addSubExtension(module.filename, 'remote');
        
        const generator = new RemoteGenerator(module, segments);
        const code = generator.generate();

        return this.#targetFileManager.write(filename, code);
    }
}
