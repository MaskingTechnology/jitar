
import SegmentProcedure from '../../../../src/building/models/SegmentProcedure';

import { SEGMENT_IMPLEMENTATIONS } from './SegmentImplementation.fixture';

const SEGMENT_PROCEDURES =
{
    CREATE_ORDER: new SegmentProcedure('order/createOrder', [SEGMENT_IMPLEMENTATIONS.CREATE_ORDER]),
    STORE_ORDER: new SegmentProcedure('order/storeOrder', [SEGMENT_IMPLEMENTATIONS.STORE_ORDER_V0, SEGMENT_IMPLEMENTATIONS.STORE_ORDER_V1]),
    GET_PRODUCTS: new SegmentProcedure('product/getProducts', [SEGMENT_IMPLEMENTATIONS.GET_PRODUCTS]),
    GET_PRODUCTS_V1: new SegmentProcedure('product/getProducts', [SEGMENT_IMPLEMENTATIONS.GET_PRODUCTS_V1]),
    GET_PRODUCTS_MERGED: new SegmentProcedure('product/getProducts', [SEGMENT_IMPLEMENTATIONS.GET_PRODUCTS, SEGMENT_IMPLEMENTATIONS.GET_PRODUCTS_V1]),
    SEARCH_PRODUCTS: new SegmentProcedure('product/searchProducts', [SEGMENT_IMPLEMENTATIONS.SEARCH_PRODUCTS]),
    SEARCH_PRODUCTS_V1: new SegmentProcedure('product/searchProducts', [SEGMENT_IMPLEMENTATIONS.SEARCH_PRODUCTS_V1]),
    SEARCH_PRODUCTS_MERGED: new SegmentProcedure('product/searchProducts', [SEGMENT_IMPLEMENTATIONS.SEARCH_PRODUCTS, SEGMENT_IMPLEMENTATIONS.SEARCH_PRODUCTS_V1])
}

export { SEGMENT_PROCEDURES }
