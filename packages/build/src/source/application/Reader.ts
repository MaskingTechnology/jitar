
import type { FileManager } from '@jitar/sourcing';

import { ModuleReader } from '../module';
import { SegmentReader } from '../segment';

import Application from './models/Application.js';

export default class Reader
{
    readonly #fileManager: FileManager;

    constructor(fileManager: FileManager)
    {
        this.#fileManager = fileManager;
    }

    async read(moduleFiles: string[], segmentFiles: string[]): Promise<Application>
    {
        const moduleReader = new ModuleReader(this.#fileManager);
        const repository = await moduleReader.readAll(moduleFiles);

        const segmentReader = new SegmentReader(this.#fileManager, repository);
        const segmentation = await segmentReader.readAll(segmentFiles);

        return new Application(repository, segmentation);
    }
}
