
import SegmentModule from '../../../../src/building/models/SegmentModule';

import { SEGMENT_PROCEDURES } from './SegmentProcedure.fixture';

const SEGMENT_MODULES =
{
    CREATE_ORDER: new SegmentModule('order/createOrder.js', [SEGMENT_PROCEDURES.CREATE_ORDER]),
    STORE_ORDER: new SegmentModule('order/storeOrder.js', [SEGMENT_PROCEDURES.STORE_ORDER]),
    GET_PRODUCTS: new SegmentModule('product/getProducts.js', [SEGMENT_PROCEDURES.GET_PRODUCTS, SEGMENT_PROCEDURES.SEARCH_PRODUCTS]),
    GET_PRODUCTS_V1: new SegmentModule('product/getProducts_v1.js', [SEGMENT_PROCEDURES.GET_PRODUCTS_V1, SEGMENT_PROCEDURES.SEARCH_PRODUCTS_V1]),
    DUPLICATE_MODULE: new SegmentModule('order/storeOrder.js', [SEGMENT_PROCEDURES.DUPLICATE_PROCEDURES])
};

export { SEGMENT_MODULES };
