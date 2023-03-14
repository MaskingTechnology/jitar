
import SegmentModule from '../../../../src/building/models/SegmentModule';

import { SEGMENT_PROCEDURES } from './SegmentProcedure.fixture';

const SEGMENT_MODULES =
{
    CREATE_ORDER: new SegmentModule('./order/createOrder.js', [SEGMENT_PROCEDURES.CREATE_ORDER]),
    STORE_ORDER: new SegmentModule('./order/storeOrder.js', [SEGMENT_PROCEDURES.STORE_ORDER]),
    GET_PRODUCTS: new SegmentModule('./product/getProduct.js', [SEGMENT_PROCEDURES.GET_PRODUCTS, SEGMENT_PROCEDURES.SEARCH_PRODUCTS])
}

export { SEGMENT_MODULES }
