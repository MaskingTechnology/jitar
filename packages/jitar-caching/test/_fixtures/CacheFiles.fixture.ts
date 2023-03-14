
const ORDER_SEGMENT_REPOSITORY = `export const files = [
\t"./order/createOrder.js",
\t"./order/storeOrder.js"
];`;

const ORDER_SEGMENT_NODE = 
`import { default as $1 } from './order/createOrder.js';
import { v0_0_0 as $2, v1_0_0 as $3 } from './order/storeOrder.js';

import { Segment, Procedure, Implementation, Version, NamedParameter, ArrayParameter, ObjectParameter } from "jitar-runtime";
export const segment = new Segment("order")
\t.addProcedure(new Procedure("order/createOrder")
\t\t.addImplementation(new Implementation("0.0.0", "private", [new NamedParameter("items", false)], $1))
\t)
\t.addProcedure(new Procedure("order/storeOrder")
\t\t.addImplementation(new Implementation("0.0.0", "public", [new NamedParameter("order", false)], $2))
\t\t.addImplementation(new Implementation("1.0.0", "public", [new NamedParameter("order", false)], $3))
\t)`;

const PRODUCT_SEGMENT_REPOSITORY = `export const files = [
\t"./product/getProducts.js"
];`;

const PRODUCT_SEGMENT_NODE = 
`import { default as $1, searchProduct as $2 } from './product/getProducts.js';

import { Segment, Procedure, Implementation, Version, NamedParameter, ArrayParameter, ObjectParameter } from "jitar-runtime";
export const segment = new Segment("product")
\t.addProcedure(new Procedure("product/getProducts")
\t\t.addImplementation(new Implementation("0.0.0", "private", [new NamedParameter("id", false)], $1))
\t)
\t.addProcedure(new Procedure("product/searchProducts")
\t\t.addImplementation(new Implementation("0.0.0", "public", [new NamedParameter("query", false)], $2))
\t)`;

const CREATE_ORDER_LOCAL = `
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

const CREATE_ORDER_REMOTE =
`import { runProcedure } from "/jitar/hooks.js";

`;

const STORE_ORDER_LOCAL =
`import { getDependency } from "/jitar/hooks.js";
const mysql = await getDependency('mysql');
const createId = await getDependency('uuid');
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

const STORE_ORDER_REMOTE =
`import { runProcedure } from "/jitar/hooks.js";

export async function v0_0_0(order) {
\treturn runProcedure('order/storeOrder', '0.0.0', { 'order': order }, this)
}

export async function v1_0_0(order) {
\treturn runProcedure('order/storeOrder', '0.0.0', { 'order': order }, this)
}
`;

const ORDER_MODELS_LOCAL = `
export class Order {}
export class OrderLine {}
`;

const GET_PRODUCTS_LOCAL =
`import { getDependency } from "/jitar/hooks.js";
const mongodb = await getDependency('mongodb');
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

const GET_PRODUCTS_REMOTE =
`import { runProcedure } from "/jitar/hooks.js";

export async function searchProducts(query) {
\treturn runProcedure('product/searchProducts', '0.0.0', { 'query': query }, this)
}
`;

const PRODUCT_MODELS_LOCAL = `
export class Product {}
`;

const CACHE_FILES =
{
    './order.segment.repository.js': ORDER_SEGMENT_REPOSITORY,
    './order.segment.node.js': ORDER_SEGMENT_NODE,
    './product.segment.repository.js': PRODUCT_SEGMENT_REPOSITORY,
    './product.segment.node.js': PRODUCT_SEGMENT_NODE,
    './order/createOrder.local.js': CREATE_ORDER_LOCAL,
    './order/createOrder.remote.js': CREATE_ORDER_REMOTE,
    './order/storeOrder.local.js': STORE_ORDER_LOCAL,
    './order/storeOrder.remote.js': STORE_ORDER_REMOTE,
    './order/models.local.js': ORDER_MODELS_LOCAL,
    './product/getProducts.local.js': GET_PRODUCTS_LOCAL,
    './product/getProducts.remote.js': GET_PRODUCTS_REMOTE,
    './product/models.local.js': PRODUCT_MODELS_LOCAL
}

export { CACHE_FILES }
