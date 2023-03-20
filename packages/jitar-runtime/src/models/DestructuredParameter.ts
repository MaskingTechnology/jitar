
import Parameter from './Parameter.js';

export default class DestructuredParameter extends Parameter
{
    #variables: Parameter[];

    constructor(key: string, variables: Parameter[])
    {
        super(key);
        
        this.#variables = variables;
    }

    get variables() { return this.#variables; }
}
