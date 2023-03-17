
import { Loadable } from 'jitar-serialization';

import NotFound from './generic/NotFound.js';

export default class ProcedureNotFound extends NotFound
{
    constructor(fqn: string)
    {
        super(`Procedure '${fqn}' not found`);
    }
}

(ProcedureNotFound as Loadable).source = '/jitar/errors/ProcedureNotFound.js';
