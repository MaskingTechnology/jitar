
import SegmentCache from '../../../../src/building/models/SegmentCache';
import SegmentImport from '../../../../src/building/models/SegmentImport';

import { SEGMENT_MODULES } from './SegmentModule.fixture';
import { SEGMENT_PROCEDURES } from './SegmentProcedure.fixture';

const ORDER = new SegmentCache
    (
        'order',
        [SEGMENT_MODULES.CREATE_ORDER.filename, SEGMENT_MODULES.STORE_ORDER.filename],
        [
            new SegmentImport(['default : $1'], SEGMENT_MODULES.CREATE_ORDER.filename),
            new SegmentImport(['v0_0_0 : $2', 'v1_0_0 : $3'], SEGMENT_MODULES.STORE_ORDER.filename)
        ],
        [SEGMENT_PROCEDURES.CREATE_ORDER, SEGMENT_PROCEDURES.STORE_ORDER]
    );

const PRODUCT = new SegmentCache
    (
        'product',
        [SEGMENT_MODULES.GET_PRODUCTS.filename],
        [
            new SegmentImport(['default : $1', 'searchProducts : $2'], SEGMENT_MODULES.GET_PRODUCTS.filename),
            new SegmentImport(['default : $3', 'searchProducts : $4'], SEGMENT_MODULES.GET_PRODUCTS_V1.filename)
        ],
        [SEGMENT_PROCEDURES.GET_PRODUCTS_MERGED, SEGMENT_PROCEDURES.SEARCH_PRODUCTS_MERGED]
    );

const DUPLICATE = new SegmentCache
    (
        'duplicate',
        [SEGMENT_MODULES.DUPLICATE_MODULE.filename],
        [
            new SegmentImport(['v0_0_0 : $1', 'v0_0_0 : $2'], SEGMENT_MODULES.DUPLICATE_MODULE.filename),
            new SegmentImport(['v1_0_0 : $3', 'v1_0_0 : $4'], SEGMENT_MODULES.DUPLICATE_MODULE.filename)
        ],
        [SEGMENT_PROCEDURES.DUPLICATE_PROCEDURES]
    );

const SEGMENT_CACHES =
{
    ORDER,
    PRODUCT,
    DUPLICATE
};

export { SEGMENT_CACHES };
