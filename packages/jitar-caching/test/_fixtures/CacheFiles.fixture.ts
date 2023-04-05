
const ORDER_SEGMENT_REPOSITORY = `export const files = [
\t"order/createOrder.js",
\t"order/storeOrder.js"
];`;

const ORDER_SEGMENT_NODE = 
`import { default as $1 } from "./order/createOrder.js";
import { v0_0_0 as $2, v1_0_0 as $3 } from "./order/storeOrder.js";
const { Segment, Procedure, Implementation, Version, NamedParameter, ArrayParameter, ObjectParameter } = await getDependency("jitar-runtime");
export const segment = new Segment("order")
\t.addProcedure(new Procedure("order/createOrder")
\t\t.addImplementation(new Implementation(new Version(0, 0, 0), "private", [new NamedParameter("items", false)], $1))
\t)
\t.addProcedure(new Procedure("order/storeOrder")
\t\t.addImplementation(new Implementation(new Version(0, 0, 0), "public", [new NamedParameter("order", false)], $2))
\t\t.addImplementation(new Implementation(new Version(1, 0, 0), "public", [new NamedParameter("...orders", false)], $3))
\t)`;

const PRODUCT_SEGMENT_REPOSITORY = `export const files = [
\t"product/getProducts.js"
];`;

const PRODUCT_SEGMENT_NODE = 
`import { default as $1, searchProducts as $2 } from "./product/getProducts.js";
import { default as $3, searchProducts as $4 } from "./product/getProducts_v1.js";
const { Segment, Procedure, Implementation, Version, NamedParameter, ArrayParameter, ObjectParameter } = await getDependency("jitar-runtime");
export const segment = new Segment("product")
\t.addProcedure(new Procedure("product/getProducts")
\t\t.addImplementation(new Implementation(new Version(0, 0, 0), "private", [new NamedParameter("id", false)], $1))
\t\t.addImplementation(new Implementation(new Version(1, 0, 0), "private", [new NamedParameter("id", false)], $3))
\t)
\t.addProcedure(new Procedure("product/searchProducts")
\t\t.addImplementation(new Implementation(new Version(0, 0, 0), "public", [new ObjectParameter([new NamedParameter("query", false), new NamedParameter("sort", false)])], $2))
\t\t.addImplementation(new Implementation(new Version(1, 0, 0), "public", [new ArrayParameter([new NamedParameter("query", false), new NamedParameter("sort", false)])], $4))
\t)`;

const CREATE_ORDER_LOCAL =
`import { Order, OrderLine } from './models';

export default async function createOrder(items)
{
    return 'order'
}

export async function createOrderLine(item)
{
    return 'order line';
}`;

const CREATE_ORDER_REMOTE = ``;

const STORE_ORDER_LOCAL =
`const mysql = await getDependency('mysql');
const createId = await getDependency('uuid');
import { Order } from './models';

export async function v0_0_0(order)
{
    return 'order v0'
}

export async function v1_0_0(...orders)
{
    return 'order v1';
}`;

const STORE_ORDER_REMOTE =
`export async function v0_0_0(order) {
\treturn runProcedure('order/storeOrder', '0.0.0', { 'order': order }, this)
}

export async function v1_0_0(...orders) {
\treturn runProcedure('order/storeOrder', '1.0.0', { '...orders': orders }, this)
}`;

const ORDER_MODELS_LOCAL =
`export class Order {}
export class OrderLine {}

Order.source = "order/models.js";
OrderLine.source = "order/models.js";`;

const GET_PRODUCTS_LOCAL =
`const mongodb = await getDependency('mongodb');
import { Product } from './models';

export default async function getProducts(id)
{
    return 'product';
}

function validateFound(product)
{
    /* ... */
}

export async function searchProducts({query, sort})
{
    return 'product list';
}`;

const GET_PRODUCTS_REMOTE =
`export async function searchProducts({ query , sort }) {
\treturn runProcedure('product/searchProducts', '0.0.0', { 'query': query, 'sort': sort }, this)
}`;

const GET_PRODUCTS_LOCAL_V1 =
`const mongodb = await getDependency('mongodb');
import { Product } from './models';

export default async function getProducts(id)
{
    return 'product';
}

function validateFound(product)
{
    /* ... */
}

export async function searchProducts([query, sort])
{
    return 'product list';
}`;

const GET_PRODUCTS_REMOTE_V1 =
`export async function searchProducts([ query , sort ]) {
\treturn runProcedure('product/searchProducts', '1.0.0', { 'query': query, 'sort': sort }, this)
}`;

const PRODUCT_MODELS_LOCAL =
`export class Product {}

Product.source = "product/models.js";`;

const CACHE_FILES =
{
    './order.segment.node.js': ORDER_SEGMENT_NODE,
    './order.segment.repository.js': ORDER_SEGMENT_REPOSITORY,
    './product.segment.node.js': PRODUCT_SEGMENT_NODE,
    './product.segment.repository.js': PRODUCT_SEGMENT_REPOSITORY,
    './order/createOrder.local.js': CREATE_ORDER_LOCAL,
    './order/createOrder.remote.js': CREATE_ORDER_REMOTE,
    './order/storeOrder.local.js': STORE_ORDER_LOCAL,
    './order/storeOrder.remote.js': STORE_ORDER_REMOTE,
    './order/models.local.js': ORDER_MODELS_LOCAL,
    './product/getProducts.local.js': GET_PRODUCTS_LOCAL,
    './product/getProducts.remote.js': GET_PRODUCTS_REMOTE,
    './product/getProducts_v1.local.js': GET_PRODUCTS_LOCAL_V1,
    './product/getProducts_v1.remote.js': GET_PRODUCTS_REMOTE_V1,
    './product/models.local.js': PRODUCT_MODELS_LOCAL
}

const CACHE_SEGMENT_FILENAMES =
[
    './order.segment.node.js',
    './order.segment.repository.js',
    './product.segment.node.js',
    './product.segment.repository.js',
];

const CACHE_MODULE_FILENAMES =
[
    './order/createOrder.js',
    './order/createOrder.local.js',
    './order/createOrder.remote.js',
    './order/storeOrder.js',
    './order/storeOrder.local.js',
    './order/storeOrder.remote.js',
    './order/models.js',
    './order/models.local.js',
    './product/getProducts.js',
    './product/getProducts.local.js',
    './product/getProducts.remote.js',
    './product/getProducts_v1.js',
    './product/getProducts_v1.local.js',
    './product/getProducts_v1.remote.js',
    './product/models.js',
    './product/models.local.js',
]

export { CACHE_FILES, CACHE_SEGMENT_FILENAMES, CACHE_MODULE_FILENAMES }
