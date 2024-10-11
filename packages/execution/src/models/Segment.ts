
import type Class from './Class';
import type Procedure from './Procedure';

export default class Segment
{
    readonly #id: string;
    readonly #classes = new Map<string, Class>();
    readonly #procedures = new Map<string, Procedure>();

    constructor(id: string)
    {
        this.#id = id;
    }

    get id() { return this.#id; }

    addClass(clazz: Class): this
    {
        this.#classes.set(clazz.fqn, clazz);

        return this;
    }

    hasClass(fqn: string): boolean
    {
        const clazz = this.getClass(fqn);

        return clazz !== undefined;
    }

    getClass(fqn: string): Class | undefined
    {
        return this.#classes.get(fqn);
    }

    getClassByImplementation(implementation: Function): Class | undefined
    {
        const classes = this.getClasses();

        return classes.find(clazz => clazz.implementation === implementation);
    }

    getClasses(): Class[]
    {
        return [...this.#classes.values()];
    }

    addProcedure(procedure: Procedure): this
    {
        this.#procedures.set(procedure.fqn, procedure);

        return this;
    }

    hasProcedure(fqn: string): boolean
    {
        return this.#procedures.has(fqn);
    }

    getProcedure(fqn: string): Procedure | undefined
    {
        return this.#procedures.get(fqn);
    }

    getExposedProcedures(): Procedure[]
    {
        const procedures = [...this.#procedures.values()];

        return procedures.filter(procedure => procedure.public || procedure.protected);
    }
}
