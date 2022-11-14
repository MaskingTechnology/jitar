
import Module from '../../core/types/Module.js';

export default class ModuleAnalyser
{
    static filterObjects(module: Module): Map<string, Object>
    {
        return this.#filterexported(module, Object);
    }

    static filterFunctions(module: Module): Map<string, Function>
    {
        const functions = this.#filterexported(module, Function);

        return this.#filterFunctionTypes(functions, false);
    }

    static filterClasses(module: Module): Map<string, Function>
    {
        const functions = this.#filterexported(module, Function);

        return this.#filterFunctionTypes(functions, true);
    }

    static #filterexported(module: Module, type: ReturnType<typeof Function>): Map<string, typeof Function>
    {
        const keys = Object.keys(module);

        const filtered = new Map();

        for (const key of keys)
        {
            const exported = module[key];

            if (exported instanceof type)
            {
                filtered.set(key, exported);
            }
        }

        return filtered;
    }

    static #filterFunctionTypes(functions: Map<string, Function>, filterClasses: boolean): Map<string, Function>
    {
        const filtered = new Map();

        for (const [key, value] of functions)
        {
            const code = value.toString();

            if (code.startsWith('class') === filterClasses)
            {
                filtered.set(key, value);
            }
        }

        return filtered;
    }
}
