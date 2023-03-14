
import { Reflector } from 'jitar-reflection';

import Module from '../../../../src/building/models/Module';

import { SOURCE_FILES } from '../../SourceFiles.fixture';

const reflector = new Reflector();

function createModule(filename: string): Module
{
    const code = SOURCE_FILES[filename];
    const content = reflector.parse(code);

    return new Module(filename, code, content);
}

const MODULES =
{
    CREATE_ORDER: createModule('./order/createOrder.js'),
    STORE_ORDER: createModule('./order/storeOrder.js'),
    GET_PRODUCTS: createModule('./product/getProducts.js'),
    ORDER_MODELS: createModule('./order/models.js'),
    PRODUCT_MODELS: createModule('./product/models.js')
}

export { MODULES }
