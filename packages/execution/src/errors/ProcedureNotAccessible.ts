
import { Forbidden } from '@jitar/errors';

export default class ProcedureNotAccessible extends Forbidden
{
    // The fqn and versionNumber are not added as private properties,
    // because this error message is never (de)serialized. It's added
    // to the globalThis object and thrown directly.

    constructor(fqn: string, versionNumber: string)
    {
        super(`Procedure '${fqn}' (v${versionNumber}) is not accessible`);
    }
}
