
import { CONSTANTS } from '../_fixtures/Constants.fixture';

const ORDER_SEGMENT_REPOSITORY = `export const files = [
\t"order/createOrder.js",
\t"order/storeOrder.js"
];`;

const ORDER_SEGMENT_WORKER = 
`const { default : $1 } = await __import("./order/createOrder.js", "application", false);
const { v0_0_0 : $2, v1_0_0 : $3 } = await __import("./order/storeOrder.js", "application", false);
const { Segment, Procedure, Implementation, Version, NamedParameter, ArrayParameter, ObjectParameter } = await __import("jitar", "runtime", false);
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

const PRODUCT_SEGMENT_WORKER = 
`const { default : $1, searchProducts : $2 } = await __import("./product/getProducts.js", "application", false);
const { default : $3, searchProducts : $4 } = await __import("./product/getProducts_v1.js", "application", false);
const { Segment, Procedure, Implementation, Version, NamedParameter, ArrayParameter, ObjectParameter } = await __import("jitar", "runtime", false);
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
`const { Order, OrderLine } = await __import("./order/models.js", "application", false);

export default async function createOrder(items)
{
    return 'order'
}

export async function createOrderLine(item)
{
    return 'order line';
}`;

const CREATE_ORDER_REMOTE =
`export default async function createOrder(items) {
\tthrow new ProcedureNotAccessible('${CONSTANTS.CREATE_ORDER_FQN}', '0.0.0');
}`;

const STORE_ORDER_LOCAL =
`const mysql = await __import("mysql", "runtime", true);
const createId = await __import("uuid", "runtime", true);
const { Order } = await __import("./order/models.js", "application", false);

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
\treturn __run('${CONSTANTS.STORE_ORDER_FQN}', '0.0.0', { 'order': order }, this);
}

export async function v1_0_0(...orders) {
\treturn __run('${CONSTANTS.STORE_ORDER_FQN}', '1.0.0', { '...orders': orders }, this);
}`;

const ORDER_MODELS_LOCAL =
`export class Order {}
export class OrderLine {}

Order.source = "./order/models.js";
OrderLine.source = "./order/models.js";`;

const GET_PRODUCTS_LOCAL =
`const mongodb = await __import("mongodb", "runtime", true);
const { Product } = await __import("./product/models.js", "application", false);

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
`export default async function getProducts(id) {
\tthrow new ProcedureNotAccessible('${CONSTANTS.GET_PRODUCTS_FQN}', '0.0.0');
}

export async function searchProducts({ query , sort }) {
\treturn __run('${CONSTANTS.SEARCH_PRODUCTS_FQN}', '0.0.0', { 'query': query, 'sort': sort }, this);
}`;

const GET_PRODUCTS_LOCAL_V1 =
`const mongodb = await __import("mongodb", "runtime", true);
const { Product } = await __import("./product/models.js", "application", false);

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
`export default async function getProducts(id) {
\tthrow new ProcedureNotAccessible('${CONSTANTS.GET_PRODUCTS_FQN}', '1.0.0');
}

export async function searchProducts([ query , sort ]) {
\treturn __run('${CONSTANTS.SEARCH_PRODUCTS_FQN}', '1.0.0', { 'query': query, 'sort': sort }, this);
}`;

const PRODUCT_MODELS_LOCAL =
`export class Product {}

Product.source = "./product/models.js";`;

const CACHE_FILES =
{
    './order.segment.worker.js': ORDER_SEGMENT_WORKER,
    './order.segment.repository.js': ORDER_SEGMENT_REPOSITORY,
    './product.segment.worker.js': PRODUCT_SEGMENT_WORKER,
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
};

const CACHE_SEGMENT_FILENAMES =
[
    './order.segment.worker.js',
    './order.segment.repository.js',
    './product.segment.worker.js',
    './product.segment.repository.js',
];

const CACHE_MODULE_FILENAMES =
[
    './order/createOrder.local.js',
    './order/createOrder.remote.js',
    './order/storeOrder.local.js',
    './order/storeOrder.remote.js',
    './order/models.local.js',
    './product/getProducts.local.js',
    './product/getProducts.remote.js',
    './product/getProducts_v1.local.js',
    './product/getProducts_v1.remote.js',
    './product/models.local.js',
];

export { CACHE_FILES, CACHE_SEGMENT_FILENAMES, CACHE_MODULE_FILENAMES };
