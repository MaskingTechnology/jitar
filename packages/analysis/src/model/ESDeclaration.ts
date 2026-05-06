
import ESStatement from './ESStatement';

export default abstract class ESDeclaration extends ESStatement
{
    identifier: string | undefined;

    constructor(identifier: string | undefined)
    {
        super();

        this.identifier = identifier;
    }

    is(identifier: string): boolean
    {
        return this.identifier === identifier;
    }
}
