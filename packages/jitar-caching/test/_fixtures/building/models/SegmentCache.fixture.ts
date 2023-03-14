
import SegmentCache from '../../../../src/building/models/SegmentCache';
import SegmentImport from '../../../../src/building/models/SegmentImport';

import { SEGMENT_MODULES } from './SegmentModule.fixture';
import { SEGMENT_PROCEDURES } from './SegmentProcedure.fixture';

const ORDER = new SegmentCache
(
    'order',
    [SEGMENT_MODULES.CREATE_ORDER.filename, SEGMENT_MODULES.STORE_ORDER.filename],
    [
        new SegmentImport(['default as $1'], SEGMENT_MODULES.CREATE_ORDER.filename),
        new SegmentImport(['v0_0_0 as $2', 'v1_0_0 as $3'], SEGMENT_MODULES.STORE_ORDER.filename)
    ],
    [SEGMENT_PROCEDURES.CREATE_ORDER, SEGMENT_PROCEDURES.STORE_ORDER]
);

const PRODUCT = new SegmentCache
(
    'product',
    [SEGMENT_MODULES.GET_PRODUCTS.filename],
    [
        new SegmentImport(['default as $1', 'searchProducts as $2'], SEGMENT_MODULES.GET_PRODUCTS.filename)
    ],
    [SEGMENT_PROCEDURES.GET_PRODUCTS, SEGMENT_PROCEDURES.SEARCH_PRODUCTS]
);

const SEGMENT_CACHES =
{
    ORDER,
    PRODUCT
}

export { SEGMENT_CACHES };
