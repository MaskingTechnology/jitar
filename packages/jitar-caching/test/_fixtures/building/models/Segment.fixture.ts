
import Segment from '../../../../src/building/models/Segment';

import { SEGMENT_MODULES } from './SegmentModule.fixture';

const SEGMENTS =
{
    ORDER: new Segment('order', [SEGMENT_MODULES.CREATE_ORDER, SEGMENT_MODULES.STORE_ORDER]),
    PRODUCT: new Segment('product', [SEGMENT_MODULES.GET_PRODUCTS])
}

export { SEGMENTS }
