
import Product from '../products/Product';

export default class OrderLine
{
    #id: string;
    #product: Product;
    #quantity: number;

    constructor(id: string, product: Product, quantity: number)
    {
        this.#id = id;
        this.#product = product;
        this.#quantity = quantity;
    }

    get id() { return this.#id; }

    get product() { return this.#product; }

    get quantity() { return this.#quantity; }
}
