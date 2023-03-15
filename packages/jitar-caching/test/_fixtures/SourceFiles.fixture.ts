
const ORDER_SEGMENT = `
{
    "./order/createOrder.js":
    {
        "default": {}
    },
    "./order/storeOrder.js":
    {
        "v0_0_0": { "access": "public", "as": "storeOrder" },
        "v1_0_0": { "access": "public", "as": "storeOrder", "version": "1.0.0" }
    }
}
`;

const PRODUCT_SEGMENT = `
{
    "./product/getProducts.js":
    {
        "default": { "access": "private" },
        "searchProducts": { "access": "public" }
    }
}
`;

const CREATE_ORDER = `
import { Order, OrderLine } from './models';

export default async function createOrder(items)
{
    return 'order'
}

export async function createOrderLine(item)
{
    return 'order line';
}
`;

const STORE_ORDER = `
import mysql from 'mysql';
import createId from 'uuid';
import { Order } from './models';

export async function v0_0_0(order)
{
    return 'order v0'
}

export async function v1_0_0(order)
{
    return 'order v1';
}
`;

const ORDER_MODELS = `
export class Order {}
export class OrderLine {}
`;

const GET_PRODUCTS = `
import * as mongodb from 'mongodb';
import { Product } from './models';

export default async function getProducts(id)
{
    return 'product';
}

function validateFound(product)
{
    /* ... */
}

export async function searchProducts(query)
{
    return 'product list';
}
`;

const PRODUCT_MODELS = `
export class Product {}
`;

const SOURCE_FILES =
{
    './order.segment.json': ORDER_SEGMENT,
    './product.segment.json': PRODUCT_SEGMENT,
    './order/createOrder.js': CREATE_ORDER,
    './order/storeOrder.js': STORE_ORDER,
    './order/models.js': ORDER_MODELS,
    './product/getProducts.js': GET_PRODUCTS,
    './product/models.js': PRODUCT_MODELS
}

const SOURCE_SEGMENT_FILENAMES =
[
    './order.segment.json',
    './product.segment.json'
]

const SOURCE_MODULE_FILENAMES =
[
    './order/createOrder.js',
    './order/storeOrder.js',
    './order/models.js',
    './product/getProducts.js',
    './product/models.js'
]

export { SOURCE_FILES, SOURCE_SEGMENT_FILENAMES, SOURCE_MODULE_FILENAMES }
