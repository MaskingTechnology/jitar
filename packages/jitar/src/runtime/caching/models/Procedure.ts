
import Implementation from './Implementation.js';

export default class Procedure
{
    #module: string;
    #name: string;
    #implementations: Implementation[] = [];

    constructor(module: string, name: string)
    {
        this.#module = module;
        this.#name = name;
    }

    get module() { return this.#module; }

    get name() { return this.#name; }

    get implementations() { return this.#implementations; }

    addImplementation(implementation: Implementation): void
    {
        this.#implementations.push(implementation);
    }
}
