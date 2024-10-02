
import { Segment } from '@jitar/execution';

import { PROCEDURES } from './procedures.fixture';

const firstSegment = new Segment('first' );
firstSegment.addProcedure(PROCEDURES.PUBLIC);

const secondSegment = new Segment('second');
secondSegment.addProcedure(PROCEDURES.PROTECTED);

export const SEGMENTS =
{
    FIRST: firstSegment,
    SECOND: secondSegment
};
