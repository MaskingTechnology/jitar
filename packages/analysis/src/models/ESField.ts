
import ESValue from './ESValue.js';

export default class ESField
{
    #name: string;
    #value: ESValue | undefined;

    constructor(name: string, value: ESValue | undefined)
    {
        this.#name = name;
        this.#value = value;
    }

    get name() { return this.#name; }

    get value() { return this.#value; }

    toString(): string
    {
        return `${this.name}${this.value ? ' = ' + this.value.toString() : ''}`;
    }
}
