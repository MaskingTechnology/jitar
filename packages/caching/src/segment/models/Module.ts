
import type Imports from '../types/Imports';

import type Implementation from './Implementation';

export default class Module
{
    #filename: string;
    #location: string;
    #imports: Imports;
    #implementations: Implementation[] = [];

    constructor(filename: string, location: string, imports: Imports)
    {
        this.#filename = filename;
        this.#location = location;
        this.#imports = imports;
    }

    get filename() { return this.#filename; }

    get location() { return this.#location; }

    get imports() { return this.#imports; }

    get implementations() { return this.#implementations; }

    addImplementation(implementation: Implementation): void
    {
        this.#implementations.push(implementation);
    }
}
