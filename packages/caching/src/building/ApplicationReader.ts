
import { FileManager } from '@jitar/runtime';

import Application from './models/Application.js';
import Segment from './models/Segment.js';
import Module from './models/Module.js';

import ModuleReader from './ModuleReader.js';
import SegmentReader from './SegmentReader.js';

export default class ApplicationReader
{
    #moduleReader: ModuleReader;
    #segmentReader: SegmentReader;

    constructor(fileManager: FileManager)
    {
        this.#moduleReader = new ModuleReader(fileManager);
        this.#segmentReader = new SegmentReader(fileManager);
    }

    async read(segmentFiles: string[], moduleFiles: string[]): Promise<Application>
    {
        return Promise.all([
            this.#readSegments(segmentFiles),
            this.#readModules(moduleFiles)
        ]).then(([segments, modules]) => new Application(segments, modules));
    }

    async #readSegments(segmentFiles: string[]): Promise<Segment[]>
    {
        return Promise.all(segmentFiles.map(async (segmentFile) => this.#segmentReader.read(segmentFile)));
    }

    async #readModules(moduleFiles: string[]): Promise<Module[]>
    {
        return Promise.all(moduleFiles.map(async (moduleFile) => this.#moduleReader.read(moduleFile)));
    }
}
