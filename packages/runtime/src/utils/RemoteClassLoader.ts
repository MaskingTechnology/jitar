
import { ClassLoader, Loadable, ClassNotFound, InvalidClass } from '@jitar/serialization';

import Import from '../models/Import.js';
import { ExecutionScopes } from '../definitions/ExecutionScope.js';

import ModuleLoader from './ModuleLoader.js';

export default class RemoteClassLoader implements ClassLoader
{
    async loadClass(loadable: Loadable): Promise<Function>
    {
        if (typeof loadable.source !== 'string')
        {
            throw new ClassNotFound(loadable.name);
        }

        const importModel = new Import('', loadable.source, ExecutionScopes.APPLICATION);
        const module = await ModuleLoader.load(importModel);
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
