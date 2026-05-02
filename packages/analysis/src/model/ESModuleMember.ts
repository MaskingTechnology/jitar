
export default class ESModuleMember
{
    readonly #identifier: string;
    readonly #alias?: string;

    constructor(identifier: string, alias?: string)
    {
        this.#identifier = identifier;
        this.#alias = alias;
    }

    get identifier() { return this.#identifier }

    get alias() { return this.#alias }

    is(identifier: string): boolean
    {
        return this.#alias === identifier
            || (this.#alias === undefined && this.#identifier === identifier);
    }

    toString(): string
    {
        if (this.#alias === undefined)
        {
            return this.#identifier;
        }

        return `${this.#identifier} as ${this.#alias}`;
    }
}
