
import { ResourceReader } from '../resource';
import { ModuleReader } from '../module';
import { SegmentReader } from '../segment';

import type ProjectFileManager from '../../ProjectFileManager';
import Application from './models/Application';

export default class Reader
{
    readonly #projectFileManager: ProjectFileManager;

    constructor(projectFileManager: ProjectFileManager)
    {
        this.#projectFileManager = projectFileManager;
    }

    async read(moduleFiles: string[], resourceFiles: string[], segmentFiles: string[]): Promise<Application>
    {
        const sourceFileManager = this.#projectFileManager.source;
        const resourceFileManager = this.#projectFileManager.resource;
        const segmentFileManager = this.#projectFileManager.segment;

        const moduleReader = new ModuleReader(sourceFileManager);
        const repository = await moduleReader.readAll(moduleFiles);

        const resourceReader = new ResourceReader(resourceFileManager, sourceFileManager);
        const resources = await resourceReader.readAll(resourceFiles);

        const segmentReader = new SegmentReader(segmentFileManager, sourceFileManager, repository);
        const segmentation = await segmentReader.readAll(segmentFiles);

        return new Application(repository, resources, segmentation);
    }
}
