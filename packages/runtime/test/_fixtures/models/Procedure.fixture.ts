
import Procedure from '../../../src/models/Procedure';

import { IMPLEMENTATIONS } from './Implementation.fixture';

const PROCEDURES =
{
    // General
    PRIVATE: new Procedure('private')
        .addImplementation(IMPLEMENTATIONS.PRIVATE),
    PROTECTED: new Procedure('protected')
        .addImplementation(IMPLEMENTATIONS.PROTECTED),
    PUBLIC: new Procedure('public')
        .addImplementation(IMPLEMENTATIONS.PUBLIC),
    PARAMETERS: new Procedure('parameter')
        .addImplementation(IMPLEMENTATIONS.PARAMETERS),
    BROKEN: new Procedure('broken')
        .addImplementation(IMPLEMENTATIONS.BROKEN),
    CONTEXT: new Procedure('context')
        .addImplementation(IMPLEMENTATIONS.CONTEXT),
    VERSIONED: new Procedure('versioned')
        .addImplementation(IMPLEMENTATIONS.V1_0_0)
        .addImplementation(IMPLEMENTATIONS.V1_0_5)
        .addImplementation(IMPLEMENTATIONS.V1_1_0),
    
    // First segment
    FIRST: new Procedure('first')
        .addImplementation(IMPLEMENTATIONS.FIRST),
    SECOND: new Procedure('second')
        .addImplementation(IMPLEMENTATIONS.SECOND),
    THIRD: new Procedure('third')
        .addImplementation(IMPLEMENTATIONS.THIRD),

    // Second segment
    FOURTH: new Procedure('fourth')
        .addImplementation(IMPLEMENTATIONS.FOURTH),
    FIFTH: new Procedure('fifth')
        .addImplementation(IMPLEMENTATIONS.FIFTH),
    SIXTH: new Procedure('sixth')
        .addImplementation(IMPLEMENTATIONS.SIXTH)
};

Object.freeze(PROCEDURES);

export { PROCEDURES };
