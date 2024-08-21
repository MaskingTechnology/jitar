
import Parameter from './Parameter';

export default class DestructuredParameter extends Parameter
{
    #variables: Parameter[];

    constructor(variables: Parameter[], name?: string, isOptional?: boolean)
    {
        super(name ?? '(anonymous)', isOptional);

        this.#variables = variables;
    }

    get variables() { return this.#variables; }
}
