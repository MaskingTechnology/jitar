
export default class ESValue
{
    #definition: string;

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
