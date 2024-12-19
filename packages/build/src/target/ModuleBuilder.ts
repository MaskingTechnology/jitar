
import type { FileManager } from '@jitar/sourcing';

import type { Application, SegmentImplementation as Implementation, Module, Segment, Segmentation, ResourcesList } from '../source';
import { FileHelper } from '../utils';

import LocalModuleBuilder from './LocalModuleBuilder';
import RemoteModuleBuilder from './RemoteModuleBuilder';

export default class ModuleBuilder
{
    readonly #fileManager: FileManager;

    readonly #localModuleBuilder = new LocalModuleBuilder();
    readonly #remoteModuleBuilder = new RemoteModuleBuilder();
    readonly #fileHelper = new FileHelper();

    constructor(fileManager: FileManager)
    {
        this.#fileManager = fileManager;
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

        // For resource files we don't want to delete the file, because it is not renamed

        if (resources.isResourceModule(module.filename))
        {
            return this.#buildResourceModule(module, resources, segmentation);
        }
        
        // If the module is not part of any segment, it is an application module
        // and these are also not renamed, therefore we don't want to delete them

        if (moduleSegments.length === 0)
        {
            return this.#buildCommonModule(module, resources, segmentation);
        }

        // Otherwise, it is a segment module that can be called remotely
        // these are renamed and we need to delete the original file that we copied

        const segmentBuilds = moduleSegments.map(segment => this.#buildSegmentModule(module, resources, segment, segmentation));

        const firstModuleSegment = moduleSegments[0];
        const segmentModule = firstModuleSegment.getModule(module.filename);

        const remoteBuild = segmentModule!.hasImplementations()
            ? this.#buildRemoteModule(module, moduleSegments)
            : [];

        await Promise.all([...segmentBuilds, remoteBuild]);

        this.#fileManager.delete(module.filename);
    }

    async #buildResourceModule(module: Module, resources: ResourcesList, segmentation: Segmentation): Promise<void>
    {
        const filename = module.filename;
        const code = this.#localModuleBuilder.build(module, resources, segmentation);

        return this.#fileManager.write(filename, code);
    }

    async #buildCommonModule(module: Module, resources: ResourcesList, segmentation: Segmentation): Promise<void>
    {
        const filename = module.filename;
        const code = this.#localModuleBuilder.build(module, resources, segmentation);

        return this.#fileManager.write(filename, code);
    }

    async #buildSegmentModule(module: Module, resources: ResourcesList, segment: Segment, segmentation: Segmentation): Promise<void>
    {
        const filename = this.#fileHelper.addSubExtension(module.filename, segment.name);
        const code = this.#localModuleBuilder.build(module, resources, segmentation, segment);

        return this.#fileManager.write(filename, code);
    }

    async #buildRemoteModule(module: Module, segments: Segment[]): Promise<void>
    {
        // The remote module contains calls to segmented procedures only

        const implementations = this.#getImplementations(module, segments);
        const filename = this.#fileHelper.addSubExtension(module.filename, 'remote');
        const code = this.#remoteModuleBuilder.build(implementations);

        return this.#fileManager.write(filename, code);
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
