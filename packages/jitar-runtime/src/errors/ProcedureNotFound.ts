
import { Loadable } from 'jitar-serialization';

import NotFound from './generic/NotFound.js';

export default class ProcedureNotFound extends NotFound
{
    #fqn: string;

    constructor(fqn: string)
    {
        super(`Procedure '${fqn}' not found`);

        this.#fqn = fqn;
    }

    get fqn() { return this.#fqn; }
}

(ProcedureNotFound as Loadable).source = '/jitar/errors/ProcedureNotFound.js';
