
import Application from './models/Application.js';
import ApplicationCache from './models/ApplicationCache.js';
import SegmentCache from './models/SegmentCache.js';
import ModuleCache from './models/ModuleCache.js';

import ModuleCacheBuilder from './ModuleCacheBuilder.js';
import SegmentCacheBuilder from './SegmentCacheBuilder.js';

export default class ApplicationCacheBuilder
{
    #moduleCacheBuilder: ModuleCacheBuilder;
    #segmentCacheBuilder: SegmentCacheBuilder;

    constructor()
    {
        this.#moduleCacheBuilder = new ModuleCacheBuilder();
        this.#segmentCacheBuilder = new SegmentCacheBuilder();
    }

    build(application: Application): ApplicationCache
    {
        const segments = this.#buildSegmentCaches(application);
        const modules = this.#buildModuleCaches(application);

        return new ApplicationCache(segments, modules);
    }

    #buildSegmentCaches(application: Application): SegmentCache[]
    {
        return application.segments.map((segment) => this.#segmentCacheBuilder.build(segment));
    }

    #buildModuleCaches(application: Application): ModuleCache[]
    {
        return application.modules.map((module) => this.#moduleCacheBuilder.build(application, module));
    }
}
