
import type { FileManager } from '@jitar/runtime';

import { Module } from '../module';
import { Segmentation, Segment } from '../segment';
import { FileHelper } from '../utils';

import type Application from './models/Application';

import RemoteModuleBuilder from './RemoteModuleBuilder';
import LocalModuleBuilder from './LocalModuleBuilder';

export default class ModuleBuilder
{
    #fileManager: FileManager;
    #localModuleBuilder: LocalModuleBuilder;
    #remoteModuleBuilder: RemoteModuleBuilder;

    constructor(fileManager: FileManager)
    {
        this.#fileManager = fileManager;

        this.#localModuleBuilder = new LocalModuleBuilder();
        this.#remoteModuleBuilder = new RemoteModuleBuilder();
    }

    async build(application: Application): Promise<void>
    {
        const repository = application.repository;
        const segmentation = application.segmentation;

        const builds = repository.modules.map(module => this.#buildModule(module, segmentation));

        await Promise.all(builds);  
    }

    async #buildModule(module: Module, segmentation: Segmentation): Promise<void>
    {
        const moduleSegments = segmentation.getSegments(module.filename);

        // If the module is not part of any segment, it is an application module

        if (moduleSegments.length === 0)
        {
            return this.#buildSharedModule(module, segmentation);
        }

        // Otherwise, it is a segment module that can be called remotely

        const segmentBuilds = moduleSegments.map(segment => this.#buildSegmentModule(module, segment, segmentation));
        const remoteBuild = this.#buildRemoteModule(module, moduleSegments);

        await Promise.all([...segmentBuilds, remoteBuild]);

        this.#fileManager.delete(module.filename);
    }

    async #buildSharedModule(module: Module, segmentation: Segmentation): Promise<void>
    {
        const filename = FileHelper.addSubExtension(module.filename, 'shared');
        const code = this.#localModuleBuilder.build(module, segmentation);

        return this.#fileManager.write(filename, code);
    }

    async #buildSegmentModule(module: Module, segment: Segment, segmentation: Segmentation): Promise<void>
    {
        const filename = FileHelper.addSubExtension(module.filename, segment.name);
        const code = this.#localModuleBuilder.build(module, segmentation, segment);

        return this.#fileManager.write(filename, code);
    }

    async #buildRemoteModule(module: Module, segments: Segment[]): Promise<void>
    {
        // The remote module contains calls to segmented procedures only

        const segmentModules = segments.map(segment => segment.getModule(module.filename));
        const implementations = segmentModules.flatMap(segmentModule => segmentModule!.implementations);

        // TODO: Make the list of implementations unique

        const filename = FileHelper.addSubExtension(module.filename, 'remote');
        const code = this.#remoteModuleBuilder.build(implementations);

        return this.#fileManager.write(filename, code);
    }
}
