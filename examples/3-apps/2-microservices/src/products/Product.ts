
export default class Product
{
    #id: string;
    #name: string;
    #price: number;

    constructor(id: string, name: string, price: number)
    {
        this.#id = id;
        this.#name = name;
        this.#price = price;
    }

    get id() { return this.#id; }

    get name() { return this.#name; }

    get price() { return this.#price; }
}
