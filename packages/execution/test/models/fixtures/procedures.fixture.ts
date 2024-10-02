
import Procedure from '../../../src/models/Procedure';

import { IMPLEMENTATIONS } from './implementations.fixture';

export const PROCEDURES =
{
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
        .addImplementation(IMPLEMENTATIONS.V1_1_0)
};
