
import { MODULE_CACHES } from './models/ModuleCache.fixture';
import { CACHE_FILES, CACHE_MODULE_FILENAMES } from '../CacheFiles.fixture';

const INPUT =
{
    CREATE_ORDER: MODULE_CACHES.CREATE_ORDER,
    STORE_ORDER: MODULE_CACHES.STORE_ORDER,
    ORDER_MODELS: MODULE_CACHES.ORDER_MODELS,
    GET_PRODUCTS: MODULE_CACHES.GET_PRODUCTS,
    GET_PRODUCTS_V1: MODULE_CACHES.GET_PRODUCTS_V1,
    PRODUCT_MODELS: MODULE_CACHES.PRODUCT_MODELS
}

const OUTPUT =
{
    FILENAMES:
    {
        CREATE_ORDER_ORIGINAL: CACHE_MODULE_FILENAMES[0],
        CREATE_ORDER_LOCAL: CACHE_MODULE_FILENAMES[1],
        CREATE_ORDER_REMOTE: CACHE_MODULE_FILENAMES[2],
        STORE_ORDER_ORIGINAL: CACHE_MODULE_FILENAMES[3],
        STORE_ORDER_LOCAL: CACHE_MODULE_FILENAMES[4],
        STORE_ORDER_REMOTE: CACHE_MODULE_FILENAMES[5],
        ORDER_MODELS_ORIGINAL: CACHE_MODULE_FILENAMES[6],
        ORDER_MODELS_LOCAL: CACHE_MODULE_FILENAMES[7],
        GET_PRODUCTS_ORIGINAL: CACHE_MODULE_FILENAMES[8],
        GET_PRODUCTS_LOCAL: CACHE_MODULE_FILENAMES[9],
        GET_PRODUCTS_REMOTE: CACHE_MODULE_FILENAMES[10],
        GET_PRODUCTS_ORIGINAL_V1: CACHE_MODULE_FILENAMES[11],
        GET_PRODUCTS_LOCAL_V1: CACHE_MODULE_FILENAMES[12],
        GET_PRODUCTS_REMOTE_V1: CACHE_MODULE_FILENAMES[13],
        PRODUCT_MODELS_ORIGINAL: CACHE_MODULE_FILENAMES[14],
        PRODUCT_MODELS_LOCAL: CACHE_MODULE_FILENAMES[15]
    },
    CONTENT:
    {
        CREATE_ORDER_LOCAL: CACHE_FILES[CACHE_MODULE_FILENAMES[1]],
        CREATE_ORDER_REMOTE: CACHE_FILES[CACHE_MODULE_FILENAMES[2]],
        STORE_ORDER_LOCAL: CACHE_FILES[CACHE_MODULE_FILENAMES[4]],
        STORE_ORDER_REMOTE: CACHE_FILES[CACHE_MODULE_FILENAMES[5]],
        ORDER_MODELS_LOCAL: CACHE_FILES[CACHE_MODULE_FILENAMES[7]],
        GET_PRODUCTS_LOCAL: CACHE_FILES[CACHE_MODULE_FILENAMES[9]],
        GET_PRODUCTS_REMOTE: CACHE_FILES[CACHE_MODULE_FILENAMES[10]],
        GET_PRODUCTS_LOCAL_V1: CACHE_FILES[CACHE_MODULE_FILENAMES[12]],
        GET_PRODUCTS_REMOTE_V1: CACHE_FILES[CACHE_MODULE_FILENAMES[13]],
        PRODUCT_MODELS_LOCAL: CACHE_FILES[CACHE_MODULE_FILENAMES[15]]
    }
}

export { INPUT, OUTPUT }
