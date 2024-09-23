
import type Module from './Module';
import type Class from './Class';
import type Procedure from './Procedure';

export default class Segment
{
    #name: string;
    #modules: Module[];
    #classes: Class[];
    #procedures: Procedure[];

    constructor(name: string, modules: Module[], classes: Class[], procedures: Procedure[])
    {
        this.#name = name;
        this.#modules = modules;
        this.#classes = classes;
        this.#procedures = procedures;
    }

    get name() { return this.#name; }

    get modules() { return this.#modules; }

    get classes() { return this.#classes; }

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
