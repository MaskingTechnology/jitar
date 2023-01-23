
import ErrorManager from './ErrorManager.js';
import ProcedureNotFound from './errors/ProcedureNotFound.js';
import Runner from './interfaces/Runner.js';
import Procedure from './Procedure.js';
import Version from './Version.js';

export default class Segment implements Runner
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

    async run(fqn: string, version: Version, args: Map<string, unknown>, headers: Map<string, string>): Promise<unknown>
    {
        const procedure = this.getProcedure(fqn);

        if (procedure === undefined)
        {
            throw new ProcedureNotFound(fqn);
        }

        try
        {
            return await procedure.run(version, args, headers);
        }
        catch (error: unknown)
        {
            throw ErrorManager.handle(error, fqn, version.toString());
        }
    }
}
