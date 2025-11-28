
import type { FileManager } from '@jitar/sourcing';

import type { Application, SegmentImplementation as Implementation, Module, Segment, Segmentation, ResourcesList } from '../../source';
import { FileHelper } from '../../utils';

import LocalBuilder from './LocalBuilder';
import RemoteBuilder from './RemoteBuilder';

export default class Builder
{
    readonly #targetFileManager: FileManager;

    readonly #localBuilder = new LocalBuilder();
    readonly #remoteBuilder = new RemoteBuilder();
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
        const code = this.#localBuilder.build(module, resources, segmentation);

        return this.#targetFileManager.write(filename, code);
    }

    async #buildSegmentModule(module: Module, resources: ResourcesList, segment: Segment, segmentation: Segmentation): Promise<void>
    {
        const filename = this.#fileHelper.addSubExtension(module.filename, segment.name);
        const code = this.#localBuilder.build(module, resources, segmentation, segment);

        return this.#targetFileManager.write(filename, code);
    }

    async #buildRemoteModule(module: Module, segments: Segment[]): Promise<void>
    {
        // The remote module contains calls to segmented procedures only

        const implementations = this.#getImplementations(module, segments);
        const filename = this.#fileHelper.addSubExtension(module.filename, 'remote');
        const code = this.#remoteBuilder.build(implementations);

        return this.#targetFileManager.write(filename, code);
    }

    #getImplementations(module: Module, segments: Segment[]): Implementation[]
    {
        const segmentModules = segments.map(segment => segment.getModule(module.filename));
        const implementations = segmentModules.flatMap(segmentModule => segmentModule!.getImplementations());

        // Implementation can be duplicated across segments
        // We need to ensure that each implementation is unique

        const unique = new Map<string, Implementation>();

        for (const implementation of implementations)
        {
            const key = `${implementation.fqn}:${implementation.version.toString()}`;

            unique.set(key, implementation);
        }

        return [...unique.values()];
    }
}
