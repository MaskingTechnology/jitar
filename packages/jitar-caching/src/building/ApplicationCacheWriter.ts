
import { FileManager } from 'jitar-runtime';

import ApplicationCache from './models/ApplicationCache';
import ModuleCache from './models/ModuleCache';
import SegmentCache from './models/SegmentCache';
import ModuleCacheWriter from './ModuleCacheWriter';
import SegmentCacheWriter from './SegmentCacheWriter';

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
        ]).then(() => {});
    }

    async #writeSegmentCache(segments: SegmentCache[]): Promise<void>
    {
        return Promise.all(segments.map(async (segment) => await this.#segmentWriter.write(segment))).then(() => {});
    }

    async #writeModuleCache(modules: ModuleCache[]): Promise<void>
    {
        return Promise.all(modules.map(async (module) => await this.#moduleWriter.write(module))).then(() => {});
    }
}
