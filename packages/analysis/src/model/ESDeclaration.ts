
import ESStatement from './ESStatement';

export default abstract class ESDeclaration extends ESStatement
{
    readonly #identifier: string | undefined;

    constructor(identifier: string | undefined)
    {
        super();

        this.#identifier = identifier;
    }

    get identifier() { return this.#identifier; }

    is(identifier: string): boolean
    {
        return this.#identifier === identifier;
    }
}
