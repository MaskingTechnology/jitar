
import ESBinding from './ESBinding';

export default class ESIdentifierBinding extends ESBinding
{
    readonly #identifier: string;
    readonly #isRest: boolean;

    constructor(identifier: string, isRest = false)
    {
        super();

        this.#identifier = identifier;
        this.#isRest = isRest;
    }

    get identifier() { return this.#identifier; }

    get isRest() { return this.#isRest; }

    toString(): string
    {
        const prefix = this.#isRest ? '...' : '';

        return `${prefix}${this.#identifier}`;
    }
}
