
import Segment from '../../../../src/building/models/Segment';

import { SEGMENT_MODULES } from './SegmentModule.fixture';

const SEGMENTS =
{
    ORDER: new Segment('order', [SEGMENT_MODULES.CREATE_ORDER, SEGMENT_MODULES.STORE_ORDER]),
    PRODUCT: new Segment('product', [SEGMENT_MODULES.GET_PRODUCTS, SEGMENT_MODULES.GET_PRODUCTS_V1]),
    DUPLICATE: new Segment('duplicate', [SEGMENT_MODULES.DUPLICATE_MODULE])
};

export { SEGMENTS };
