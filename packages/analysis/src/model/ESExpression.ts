
import ESStatement from './ESStatement';

export default class ESExpression extends ESStatement
{
    code: string;

    constructor(code: string)
    {
        super();

        this.code = code;
    }

    clone(): ESExpression
    {
        return new ESExpression(this.code);
    }

    toString(terminate = true): string
    {
        const terminator = terminate === false || this.code.endsWith('}') ? '' : ';';

        return `${this.code}${terminator}`;
    }
}
