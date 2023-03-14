
import SegmentProcedure from '../../../../src/building/models/SegmentProcedure';

import { SEGMENT_IMPLEMENTATIONS } from './SegmentImplementation.fixture';

const SEGMENT_PROCEDURES =
{
    CREATE_ORDER: new SegmentProcedure('order/createOrder', [SEGMENT_IMPLEMENTATIONS.CREATE_ORDER]),
    STORE_ORDER: new SegmentProcedure('order/storeOrder', [SEGMENT_IMPLEMENTATIONS.STORE_ORDER_V0, SEGMENT_IMPLEMENTATIONS.STORE_ORDER_V1]),
    GET_PRODUCTS: new SegmentProcedure('product/getProducts', [SEGMENT_IMPLEMENTATIONS.GET_PRODUCTS]),
    SEARCH_PRODUCTS: new SegmentProcedure('product/searchProducts', [SEGMENT_IMPLEMENTATIONS.SEARCH_PRODUCTS])
}

export { SEGMENT_PROCEDURES }
