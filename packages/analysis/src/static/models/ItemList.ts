
export default class ItemList<T>
{
    readonly #items: T[];
    #position: number;

    constructor(items: T[])
    {
        this.#items = items;
        this.#position = 0;
    }

    get items() { return this.#items; }

    get position() { return this.#position; }

    get size() { return this.#items.length; }

    get eol() { return this.#position >= this.#items.length; }

    get current() { return this.#items[this.#position]; }

    get next() { return this.#items[this.#position + 1]; }

    get previous() { return this.#items[this.#position - 1]; }

    notAtEnd(): boolean
    {
        return this.eol === false;
    }

    get(index: number): T
    {
        return this.#items[index];
    }

    step(amount = 1): T
    {
        this.#position += amount;

        return this.current;
    }

    stepBack(amount = 1): T
    {
        this.#position -= amount;

        return this.current;
    }

    hasNext(): boolean
    {
        return this.#position + 1 < this.#items.length;
    }
}
