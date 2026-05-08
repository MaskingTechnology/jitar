
import ESBinding from './ESBinding';

export default class ESIdentifierBinding extends ESBinding
{
    identifier: string;
    isRest: boolean;

    constructor(identifier: string, isRest = false)
    {
        super();

        this.identifier = identifier;
        this.isRest = isRest;
    }

    clone(): ESIdentifierBinding
    {
        return new ESIdentifierBinding(this.identifier, this.isRest);
    }

    toString(): string
    {
        const prefix = this.isRest ? '...' : '';

        return `${prefix}${this.identifier}`;
    }
}
