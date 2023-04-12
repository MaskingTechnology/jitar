
import NamedParameter from '../../../src/models/NamedParameter';

const PARAMETERS =
{
    MANDATORY: new NamedParameter('mandatory', false),
    OPTIONAL: new NamedParameter('optional', true)
}

Object.freeze(PARAMETERS);

export { PARAMETERS }
