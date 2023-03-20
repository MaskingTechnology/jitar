
import Parameter from './Parameter.js';

export default class NamedParameter extends Parameter
{
    #isOptional: boolean;

    constructor(name: string, isOptional: boolean)
    {
        super(name);
        
        this.#isOptional = isOptional;
    }

    get name() { return this.key; }

    get isOptional() { return this.#isOptional; }
}
