
import { ReflectionModule, ReflectionFunction, ReflectionDeclaration, ReflectionClass } from 'jitar-reflection';

export default class ModuleAnalyser
{
    static filterFields(module: ReflectionModule): Map<string, ReflectionDeclaration>
    {
        return this.#filterexported<ReflectionDeclaration>(module, ReflectionDeclaration);
    }

    static filterFunctions(module: ReflectionModule): Map<string, ReflectionFunction>
    {
        return this.#filterexported<ReflectionFunction>(module, ReflectionFunction);
    }

    static filterClasses(module: ReflectionModule): Map<string, ReflectionClass>
    {
        return this.#filterexported<ReflectionClass>(module, ReflectionClass);
    }

    // Quick fix, this will be solved when migrating to the cache package
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static #filterexported<T>(module: ReflectionModule, type: any): Map<string, T>
    {
        const keys = [...module.exported.keys()]

        const filtered = new Map();

        for (const key of keys)
        {
            const member = module.getExported(key) as T;

            if (member?.constructor.name === type.name)
            {
                filtered.set(key, member);
            }
        }

        return filtered;
    }
}
