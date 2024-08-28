
import type Module from './Module';
import type Procedure from './Procedure';

export default class Segment
{
    #name: string;
    #modules: Module[];
    #procedures: Procedure[];

    constructor(name: string, modules: Module[], procedures: Procedure[])
    {
        this.#name = name;
        this.#modules = modules;
        this.#procedures = procedures;
    }

    get name() { return this.#name; }

    get modules() { return this.#modules; }

    get procedures() { return this.#procedures; }

    hasModule(filename: string): boolean
    {
        return this.#modules.some(module => module.filename === filename);
    }

    getModule(filename: string): Module | undefined
    {
        return this.#modules.find(module => module.filename === filename);
    }

    hasProcedure(fqn: string): boolean
    {
        return this.#procedures.some(procedure => procedure.fqn === fqn);
    }

    getProcedure(fqn: string): Procedure | undefined
    {
        return this.#procedures.find(procedure => procedure.fqn === fqn);
    }
}
