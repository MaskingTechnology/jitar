
import { SEGMENT_CACHES } from './models/SegmentCache.fixture';
import { CACHE_FILES, CACHE_SEGMENT_FILENAMES } from '../CacheFiles.fixture';

const INPUT =
{
    ORDER: SEGMENT_CACHES.ORDER,
    PRODUCT: SEGMENT_CACHES.PRODUCT
}

const OUTPUT =
{
    FILENAMES:
    {
        ORDER_NODE: CACHE_SEGMENT_FILENAMES[0],
        ORDER_REPOSITORY: CACHE_SEGMENT_FILENAMES[1],
        PRODUCT_NODE: CACHE_SEGMENT_FILENAMES[2],
        PRODUCT_REPOSITORY: CACHE_SEGMENT_FILENAMES[3]
    },
    CONTENT:
    {
        ORDER_NODE: CACHE_FILES[CACHE_SEGMENT_FILENAMES[0]],
        ORDER_REPOSITORY: CACHE_FILES[CACHE_SEGMENT_FILENAMES[1]],
        PRODUCT_NODE: CACHE_FILES[CACHE_SEGMENT_FILENAMES[2]],
        PRODUCT_REPOSITORY: CACHE_FILES[CACHE_SEGMENT_FILENAMES[3]]
    }
}

export { INPUT, OUTPUT }
