
import type { FileManager } from '@jitar/sourcing';

import type { Application, SegmentImplementation as Implementation, Module, Segment, Segmentation, ResourceList } from '../source';
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

        const builds = repository.modules.map(module => this.#buildModule(resources, module, segmentation));

        await Promise.all(builds);
    }

    async #buildModule(resources: ResourceList, module: Module, segmentation: Segmentation): Promise<void>
    {
        const moduleSegments = segmentation.getSegments(module.filename);

        // For resource files we don't want to rewrite the file, just copy it

        if (resources.isModuleResource(module.filename))
        {
            return this.#buildResourceModule(resources, module, segmentation);
        }
        
        // If the module is not part of any segment, it is an application module

        if (moduleSegments.length === 0)
        {
            await this.#buildCommonModule(resources, module, segmentation);
        }
        else
        {
            // Otherwise, it is a segment module that can be called remotely

            const segmentBuilds = moduleSegments.map(segment => this.#buildSegmentModule(resources, module, segment, segmentation));

            const firstModuleSegment = moduleSegments[0];
            const segmentModule = firstModuleSegment.getModule(module.filename);

            const remoteBuild = segmentModule!.hasImplementations()
                ? this.#buildRemoteModule(module, moduleSegments)
                : [];

            await Promise.all([...segmentBuilds, remoteBuild]);
        }

        this.#fileManager.delete(module.filename);
    }

    async #buildResourceModule(resources: ResourceList, module: Module, segmentation: Segmentation): Promise<void>
    {
        const filename = module.filename;
        const code = this.#localModuleBuilder.build(resources, module, segmentation);

        return this.#fileManager.write(filename, code);
    }

    async #buildCommonModule(resources: ResourceList, module: Module, segmentation: Segmentation): Promise<void>
    {
        const filename = this.#fileHelper.addSubExtension(module.filename, 'common');
        const code = this.#localModuleBuilder.build(resources, module, segmentation);

        return this.#fileManager.write(filename, code);
    }

    async #buildSegmentModule(resources: ResourceList, module: Module, segment: Segment, segmentation: Segmentation): Promise<void>
    {
        const filename = this.#fileHelper.addSubExtension(module.filename, segment.name);
        const code = this.#localModuleBuilder.build(resources, module, segmentation, segment);

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
