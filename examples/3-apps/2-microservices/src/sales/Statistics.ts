
export default class Statistics
{
    #orderCount: number;
    #customerCount: number;
    #revenue: number;

    constructor(orderCount: number, customerCount: number, revenue: number)
    {
        this.#orderCount = orderCount;
        this.#customerCount = customerCount;
        this.#revenue = revenue;
    }

    get orderCount() { return this.#orderCount; }

    get customerCount() { return this.#customerCount; }

    get revenue() { return this.#revenue; }
}
