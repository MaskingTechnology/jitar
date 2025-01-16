
import type Module from './Module';
import type Class from './Class';
import type Procedure from './Procedure';

export default class Segment
{
    readonly #name: string;
    readonly #modules = new Map<string, Module>();
    readonly #classes = new Map<string, Class>();
    readonly #procedures = new Map<string, Procedure>();

    constructor(name: string)
    {
        this.#name = name;
    }

    get name() { return this.#name; }

    get modules() { return [...this.#modules.values()]; }

    get classes() { return [...this.#classes.values()]; }

    get procedures() { return [...this.#procedures.values()]; }

    hasModule(filename: string): boolean
    {
        return this.#modules.has(filename);
    }

    getModule(filename: string): Module | undefined
    {
        return this.#modules.get(filename);
    }

    setModule(module: Module): void
    {
        this.#modules.set(module.filename, module);
    }

    hasProcedure(fqn: string): boolean
    {
        return this.#procedures.has(fqn);
    }

    getProcedure(fqn: string): Procedure | undefined
    {
        return this.#procedures.get(fqn);
    }

    setProcedure(procedure: Procedure): void
    {
        this.#procedures.set(procedure.fqn, procedure);
    }

    setClass(klass: Class): void
    {
        this.#classes.set(klass.fqn, klass);
    }
}
