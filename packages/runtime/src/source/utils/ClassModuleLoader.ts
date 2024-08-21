
import { ClassLoader, Loadable, ClassNotFound, InvalidClass } from '@jitar/serialization';

import ModuleImporter from '../interfaces/ModuleImporter';

export default class ClassModuleLoader implements ClassLoader
{
    #moduleImporter: ModuleImporter;

    constructor(moduleImporter: ModuleImporter)
    {
        this.#moduleImporter = moduleImporter;
    }

    async loadClass(loadable: Loadable): Promise<Function>
    {
        if (typeof loadable.source !== 'string')
        {
            throw new ClassNotFound(loadable.name);
        }

        const module = await this.#moduleImporter.import(loadable.source);
        const clazz = (module[loadable.name] ?? module['default']) as Function;

        if (clazz === undefined)
        {
            throw new ClassNotFound(loadable.name);
        }
        else if ((clazz instanceof Function) === false)
        {
            throw new InvalidClass(loadable.name);
        }

        return clazz;
    }
}
