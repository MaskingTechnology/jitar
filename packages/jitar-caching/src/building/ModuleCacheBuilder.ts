
import Application from './models/Application';
import Module from './models/Module';
import ModuleCache from './models/ModuleCache.js';

export default class ModuleCacheBuilder
{
    build(application: Application, module: Module): ModuleCache
    {
        const segment = application.getSegmentModule(module.filename);

        return new ModuleCache(module, segment);
    }
}
