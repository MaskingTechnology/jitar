
export default class Parameter
{
    #name: string;
    #isOptional: boolean;

    constructor(name: string, isOptional = false)
    {
        this.#name = name;
        this.#isOptional = isOptional;
    }

    get name() { return this.#name; }

    get isOptional() { return this.#isOptional; }
}
