
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

    toString(terminate = true): string
    {
        const terminator = terminate === false || this.#code.endsWith('}') ? '' : ';';

        return `${this.#code}${terminator}`;
    }
}
