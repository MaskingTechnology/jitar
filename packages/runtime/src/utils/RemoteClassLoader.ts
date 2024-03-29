
import { ClassLoader, Loadable, ClassNotFound, InvalidClass } from '@jitar/serialization';

import ModuleLoader from './ModuleLoader.js';

export default class RemoteClassLoader implements ClassLoader
{
    async loadClass(loadable: Loadable): Promise<Function>
    {
        if (typeof loadable.source !== 'string')
        {
            throw new ClassNotFound(loadable.name);
        }

        const module = await ModuleLoader.load(loadable.source);
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
