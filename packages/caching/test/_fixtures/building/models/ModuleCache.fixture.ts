
import ModuleCache from '../../../../src/building/models/ModuleCache';

import { MODULES } from './Module.fixture';
import { SEGMENT_MODULES } from './SegmentModule.fixture';

const MODULE_CACHES =
{
    CREATE_ORDER: new ModuleCache(MODULES.CREATE_ORDER, SEGMENT_MODULES.CREATE_ORDER),
    STORE_ORDER: new ModuleCache(MODULES.STORE_ORDER, SEGMENT_MODULES.STORE_ORDER),
    GET_PRODUCTS: new ModuleCache(MODULES.GET_PRODUCTS, SEGMENT_MODULES.GET_PRODUCTS),
    GET_PRODUCTS_V1: new ModuleCache(MODULES.GET_PRODUCTS_V1, SEGMENT_MODULES.GET_PRODUCTS_V1),
    ORDER_MODELS: new ModuleCache(MODULES.ORDER_MODELS, undefined),
    PRODUCT_MODELS: new ModuleCache(MODULES.PRODUCT_MODELS, undefined)
};

export { MODULE_CACHES };
