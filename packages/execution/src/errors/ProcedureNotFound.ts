
import { NotFound } from '@jitar/errors';

export default class ProcedureNotFound extends NotFound
{
    readonly #fqn: string;

    constructor(fqn: string)
    {
        super(`Procedure '${fqn}' not found`);

        this.#fqn = fqn;
    }

    get fqn() { return this.#fqn; }
}
