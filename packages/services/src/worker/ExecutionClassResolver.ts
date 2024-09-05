
import { ClassResolver, ClassNotFound } from '@jitar/serialization';
import type { ExecutionManager } from '@jitar/execution';

export default class ExecutionClassResolver implements ClassResolver
{
    #executionManager: ExecutionManager;

    constructor(executionManager: ExecutionManager)
    {
        this.#executionManager = executionManager;
    }

    resolveKey(clazz: Function): string
    {
        const model = this.#executionManager.getClassByImplementation(clazz);

        if (model === undefined)
        {
            throw new ClassNotFound(clazz.name);
        }

        return model.fqn;
    }

    resolveClass(key: string): Function
    {
        const model = this.#executionManager.getClass(key);

        if (model === undefined)
        {
            throw new ClassNotFound(key);
        }

        return model.implementation;
    }
}
