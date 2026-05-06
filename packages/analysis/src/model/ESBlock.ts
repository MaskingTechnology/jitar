
import ESStatement from './ESStatement';

export default class ESBlock extends ESStatement
{
    code: string;

    constructor(code: string)
    {
        super();

        this.code = code;
    }

    clone(): ESBlock
    {
        return new ESBlock(this.code);
    }

    toString(): string
    {
        return this.code;
    }
}
