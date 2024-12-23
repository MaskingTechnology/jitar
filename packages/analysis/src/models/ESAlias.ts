
export default class ESAlias
{
    readonly #name: string;
    readonly #as: string;

    constructor(name: string, as: string)
    {
        this.#name = name;
        this.#as = as;
    }

    get name(): string { return this.#name; }

    get as(): string { return this.#as; }

    toString(): string
    {
        return `${this.#name} as ${this.#as}`;
    }
}
