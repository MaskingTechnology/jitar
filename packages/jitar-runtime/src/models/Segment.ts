
import Procedure from './Procedure.js';

export default class Segment
{
    #id: string;
    #procedures: Map<string, Procedure> = new Map();

    constructor(id: string)
    {
        this.#id = id;
    }

    get id() { return this.#id; }

    addProcedure(procedure: Procedure): void
    {
        this.#procedures.set(procedure.fqn, procedure);
    }

    hasProcedure(fqn: string): boolean
    {
        const procedure = this.getProcedure(fqn);

        return procedure !== undefined;
    }

    getProcedure(fqn: string): Procedure | undefined
    {
        return this.#procedures.get(fqn);
    }

    getPublicProcedures()
    {
        const procedures = [...this.#procedures.values()];

        return procedures.filter(procedure => procedure.public);
    }
}
