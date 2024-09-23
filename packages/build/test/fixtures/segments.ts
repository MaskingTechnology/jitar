
import Segment from '../../src/segment/models/Segment';

import { SEGMENT_MODULES as MODULES } from './segmentModules';
import { SEGMENT_PROCEDURES as PROCEDURES } from './segmentProcedures';

const SEGMENTS =
{
    FIRST: new Segment('first', [MODULES.A, MODULES.B, MODULES.C], [PROCEDURES.A, PROCEDURES.B, PROCEDURES.C]),
    SECOND: new Segment('second', [MODULES.E, MODULES.F, MODULES.G], [PROCEDURES.E, PROCEDURES.F, PROCEDURES.G]),
};

export { SEGMENTS };
