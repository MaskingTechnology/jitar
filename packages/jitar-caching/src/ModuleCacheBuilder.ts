
import Application from './models/Application';
import Module from './models/Module';
import ModuleCache from './models/ModuleCache.js';

export default class ModuleCacheBuilder
{
    build(application: Application, module: Module): ModuleCache
    {
        const filename = module.filename;
        const code = module.code;
        const classes = module.content.exportedClasses;
        const functions = module.content.exportedFunctions;

        return new ModuleCache(filename, code, classes, functions);
    }
}
