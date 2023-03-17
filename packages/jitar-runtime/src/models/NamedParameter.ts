
import Parameter from '../interfaces/Parameter.js';

export default class NamedParameter implements Parameter
{
    #name: string;
    #isOptional: boolean;

    constructor(name: string, isOptional: boolean)
    {
        this.#name = name;
        this.#isOptional = isOptional;
    }

    get name() { return this.#name; }

    get isOptional() { return this.#isOptional; }
}
