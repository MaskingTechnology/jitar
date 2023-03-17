
import Application from '../../../../src/building/models/Application';

import { SEGMENTS } from './Segment.fixture';
import { MODULES } from './Module.fixture';

const APPLICATION = new Application
(
    [SEGMENTS.ORDER, SEGMENTS.PRODUCT],
    [MODULES.CREATE_ORDER, MODULES.STORE_ORDER, MODULES.GET_PRODUCTS, MODULES.GET_PRODUCTS_V1, MODULES.ORDER_MODELS, MODULES.PRODUCT_MODELS]
);

export { APPLICATION }
