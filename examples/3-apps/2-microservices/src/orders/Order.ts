
import Customer from '../customers/Customer';
import OrderLine from './OrderLine';

export default class Order
{
    #id: string;
    #customer: Customer;
    #lines: OrderLine[];

    constructor(id: string, customer: Customer, lines?: OrderLine[])
    {
        this.#id = id;
        this.#customer = customer;
        this.#lines = lines ?? [];
    }

    get id() { return this.#id; }

    get customer() { return this.#customer; }

    get lines() { return this.#lines; }

    get total() { return this.#lines.reduce((total, line) => total + line.product.price * line.quantity, 0); }

    addLine(line: OrderLine)
    {
        this.#lines.push(line);
    }
}
