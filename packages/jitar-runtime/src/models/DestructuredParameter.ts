
import Parameter from '../interfaces/Parameter.js';

export default class DestructuredParameter implements Parameter
{
    #variables: Parameter[];

    constructor(variables: Parameter[])
    {
        this.#variables = variables;
    }

    get variables() { return this.#variables; }
}
