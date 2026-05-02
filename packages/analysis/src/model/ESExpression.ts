
import ESStatement from './ESStatement';

export default class ESExpression extends ESStatement
{
    readonly #code: string;

    constructor(code: string)
    {
        super();

        this.#code = code;
    }

    get code() { return this.#code; }

    toString(): string
    {
        return this.#code;
    }
}
