
export default class ESValue
{
    readonly #definition: string;

    constructor(definition: string)
    {
        this.#definition = definition;
    }

    get definition() { return this.#definition; }

    toString(): string
    {
        return this.#definition;
    }
}
