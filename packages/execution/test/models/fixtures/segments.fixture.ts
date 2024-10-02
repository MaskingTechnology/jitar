
import Segment from '../../../src/models/Segment';

import { PROCEDURES } from './procedures.fixture';

export const SEGMENTS =
{
    GENERAL: new Segment('general')
        .addProcedure(PROCEDURES.PRIVATE)
        .addProcedure(PROCEDURES.PROTECTED)
        .addProcedure(PROCEDURES.PUBLIC)
        .addProcedure(PROCEDURES.PARAMETERS)
        .addProcedure(PROCEDURES.BROKEN)
        .addProcedure(PROCEDURES.CONTEXT)
        .addProcedure(PROCEDURES.VERSIONED)
};
