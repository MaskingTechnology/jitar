
export default class Parameter
{
    readonly #name: string;
    readonly #isOptional: boolean;

    constructor(name: string, isOptional = false)
    {
        this.#name = name;
        this.#isOptional = isOptional;
    }

    get name() { return this.#name; }

    get isOptional() { return this.#isOptional; }
}
