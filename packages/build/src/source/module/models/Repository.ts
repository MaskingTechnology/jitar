
import type Module from './Module';

export default class Repository
{
    readonly #modules: Module[];

    constructor(modules: Module[])
    {
        this.#modules = modules;
    }

    get modules() { return this.#modules; }

    get(filename: string): Module | undefined
    {
        return this.#modules.find(module => module.filename === filename);
    }
}
