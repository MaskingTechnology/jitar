
import ApplicationCache from '../../../../src/building/models/ApplicationCache';

import { SEGMENT_CACHES } from './SegmentCache.fixture';
import { MODULE_CACHES } from './ModuleCache.fixture';

const APPLICATION_CACHE = new ApplicationCache
(
    [SEGMENT_CACHES.ORDER, SEGMENT_CACHES.PRODUCT],
    [MODULE_CACHES.CREATE_ORDER, MODULE_CACHES.STORE_ORDER, MODULE_CACHES.GET_PRODUCTS, MODULE_CACHES.GET_PRODUCTS_V1, MODULE_CACHES.ORDER_MODELS, MODULE_CACHES.PRODUCT_MODELS],
);

export { APPLICATION_CACHE };
