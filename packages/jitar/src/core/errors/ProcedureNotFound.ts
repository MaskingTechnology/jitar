
import Component from '../types/Component.js';
import NotFound from './NotFound.js';

export default class ProcedureNotFound extends NotFound
{
    constructor(fqn: string)
    {
        super(`Procedure '${fqn}' not found`);
    }
}

(ProcedureNotFound as Component).source = '/jitar/core/errors/ProcedureNotFound.js';
