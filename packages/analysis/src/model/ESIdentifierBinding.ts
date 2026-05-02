
import ESBinding from './ESBinding';

export default class ESIdentifierBinding extends ESBinding
{
    readonly #identifier: string;

    constructor(identifier: string)
    {
        super();

        this.#identifier = identifier;
    }

    get identifier() { return this.#identifier; }

    toString(): string
    {
        return this.#identifier;
    }
}
