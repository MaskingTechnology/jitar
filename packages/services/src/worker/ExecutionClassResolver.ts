
import { ClassResolver } from '@jitar/serialization';
import type { ExecutionManager } from '@jitar/execution';

export default class ExecutionClassResolver implements ClassResolver
{
    #executionManager: ExecutionManager;

    constructor(executionManager: ExecutionManager)
    {
        this.#executionManager = executionManager;
    }

    resolveKey(clazz: Function): string | undefined
    {
        const model = this.#executionManager.getClassByImplementation(clazz);

        return model?.fqn;
    }

    resolveClass(key: string): Function | undefined
    {
        const model = this.#executionManager.getClass(key);

        return model?.implementation;
    }
}
