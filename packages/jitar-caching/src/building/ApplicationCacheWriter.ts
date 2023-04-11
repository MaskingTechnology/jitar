
import { FileManager } from '@jitar/runtime';

import ApplicationCache from './models/ApplicationCache.js';
import ModuleCache from './models/ModuleCache.js';
import SegmentCache from './models/SegmentCache.js';
import ModuleCacheWriter from './ModuleCacheWriter.js';
import SegmentCacheWriter from './SegmentCacheWriter.js';

export default class ApplicationCacheWriter
{
    #moduleWriter: ModuleCacheWriter;
    #segmentWriter: SegmentCacheWriter;

    constructor(fileManager: FileManager)
    {
        this.#moduleWriter = new ModuleCacheWriter(fileManager);
        this.#segmentWriter = new SegmentCacheWriter(fileManager);
    }

    async write(cache: ApplicationCache): Promise<void>
    {
        return Promise.all([
            this.#writeSegmentCache(cache.segments),
            this.#writeModuleCache(cache.modules)
        ]).then(() => undefined);
    }

    async #writeSegmentCache(segments: SegmentCache[]): Promise<void>
    {
        return Promise.all(segments.map(async (segment) => await this.#segmentWriter.write(segment))).then(() => undefined);
    }

    async #writeModuleCache(modules: ModuleCache[]): Promise<void>
    {
        return Promise.all(modules.map(async (module) => await this.#moduleWriter.write(module))).then(() => undefined);
    }
}
