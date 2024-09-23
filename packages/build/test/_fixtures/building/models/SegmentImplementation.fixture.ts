
import { ReflectionFunction } from '@jitar/reflection';

import SegmentImplementation from '../../../../src/building/models/SegmentImplementation';

import { MODULES } from './Module.fixture';

const CREATE_ORDER = MODULES.CREATE_ORDER.content.getFunction('createOrder') as ReflectionFunction;
const STORE_ORDER_V0 = MODULES.STORE_ORDER.content.getFunction('v0_0_0') as ReflectionFunction;
const STORE_ORDER_V1 = MODULES.STORE_ORDER.content.getFunction('v1_0_0') as ReflectionFunction;
const GET_PRODUCTS = MODULES.GET_PRODUCTS.content.getFunction('getProducts') as ReflectionFunction;
const SEARCH_PRODUCTS = MODULES.GET_PRODUCTS.content.getFunction('searchProducts') as ReflectionFunction;
const SEARCH_PRODUCTS_V1 = MODULES.GET_PRODUCTS_V1.content.getFunction('searchProducts') as ReflectionFunction;

const SEGMENT_IMPLEMENTATIONS =
{
    CREATE_ORDER: new SegmentImplementation('$1', 'default', 'private', '0.0.0', CREATE_ORDER),
    STORE_ORDER_V0: new SegmentImplementation('$2', 'v0_0_0', 'public', '0.0.0', STORE_ORDER_V0),
    STORE_ORDER_V1: new SegmentImplementation('$3', 'v1_0_0', 'public', '1.0.0', STORE_ORDER_V1),
    GET_PRODUCTS: new SegmentImplementation('$1', 'default', 'private', '0.0.0', GET_PRODUCTS),
    SEARCH_PRODUCTS: new SegmentImplementation('$2', 'searchProducts', 'public', '0.0.0', SEARCH_PRODUCTS),
    GET_PRODUCTS_V1: new SegmentImplementation('$3', 'default', 'private', '1.0.0', GET_PRODUCTS),
    SEARCH_PRODUCTS_V1: new SegmentImplementation('$4', 'searchProducts', 'public', '1.0.0', SEARCH_PRODUCTS_V1),
    STORE_ORDER_V0_DUPLICATE: new SegmentImplementation('$1', 'v0_0_0', 'public', '0.0.0', STORE_ORDER_V0),
};

export { SEGMENT_IMPLEMENTATIONS };
