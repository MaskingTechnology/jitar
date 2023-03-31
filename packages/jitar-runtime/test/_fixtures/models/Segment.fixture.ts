
import Segment from '../../../src/models/Segment';

import { PROCEDURES } from './Procedure.fixture';

const SEGMENTS =
{
    GENERAL: new Segment('general')
        .addProcedure(PROCEDURES.PRIVATE)
        .addProcedure(PROCEDURES.PUBLIC)
        .addProcedure(PROCEDURES.PARAMETERS)
        .addProcedure(PROCEDURES.BROKEN)
        .addProcedure(PROCEDURES.CONTEXT)
        .addProcedure(PROCEDURES.VERSIONED),

    FIRST: new Segment('first')
        .addProcedure(PROCEDURES.FIRST)
        .addProcedure(PROCEDURES.SECOND)
        .addProcedure(PROCEDURES.THIRD),

    SECOND: new Segment('second')
        .addProcedure(PROCEDURES.FOURTH)
        .addProcedure(PROCEDURES.FIFTH)
        .addProcedure(PROCEDURES.SIXTH)
}

Object.freeze(SEGMENTS);

const SEGMENT_FILES =
{
    GENERAL: ['private.js', 'public.js', 'parameters.js', 'broken.js', 'context.js', 'versioned.js'],
    FIRST: ['first.js', 'second.js', 'third.js'],
    SECOND: ['fourth.js', 'fifth.js', 'sixth.js']
}

export { SEGMENTS, SEGMENT_FILES }
