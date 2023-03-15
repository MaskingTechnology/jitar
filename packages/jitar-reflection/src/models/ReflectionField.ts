
import ReflectionValue from './ReflectionValue.js';

export default class ReflectionField
{
    #name: string;
    #value: ReflectionValue | undefined;

    constructor(name: string, value: ReflectionValue | undefined)
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
