
import { Forbidden } from '@jitar/errors';

export default class ProcedureNotAccessible extends Forbidden
{
    constructor(fqn: string, versionNumber: string)
    {
        super(`Procedure '${fqn}' (v${versionNumber}) is not accessible`);
    }
}
