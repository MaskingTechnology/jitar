
import ClassNotFound from './errors/ClassNotFound.js';
import InvalidClass from './errors/InvalidClass.js';
import ClassLoader from './interfaces/ClassLoader.js';
import Loadable from './types/Loadable.js';

export default class DefaultClassLoader implements ClassLoader
{
    async loadClass(loadable: Loadable): Promise<Function>
    {
        if (typeof loadable.source !== 'string')
        {
            throw new ClassNotFound(loadable.name);
        }

        const module = await import(loadable.source);
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
