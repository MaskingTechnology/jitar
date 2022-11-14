
import Component from '../types/Component.js';

export default class ProcedureNotFound extends Error
{
    constructor(fqn: string)
    {
        super(`Procedure '${fqn}' not found`);
    }
}

(ProcedureNotFound as Component).source = '/jitar/core/errors/ProcedureNotFound.js';
