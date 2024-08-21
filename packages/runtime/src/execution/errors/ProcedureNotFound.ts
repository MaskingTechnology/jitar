
import { Loadable } from '@jitar/serialization';

import ExecutionError from './ExecutionError';

export default class ProcedureNotFound extends ExecutionError
{
    #fqn: string;

    constructor(fqn: string)
    {
        super(`Procedure '${fqn}' not found`);

        this.#fqn = fqn;
    }

    get fqn() { return this.#fqn; }
}

(ProcedureNotFound as Loadable).source = 'RUNTIME_ERROR_LOCATION';
