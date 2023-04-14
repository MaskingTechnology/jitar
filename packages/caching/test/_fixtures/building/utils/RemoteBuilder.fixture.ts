
import { SEGMENT_MODULES } from '../models/SegmentModule.fixture';
import { CACHE_FILES } from '../../CacheFiles.fixture';

const INPUT = SEGMENT_MODULES.GET_PRODUCTS;
const OUTPUT = CACHE_FILES['./product/getProducts.remote.js'];

export { INPUT, OUTPUT };
