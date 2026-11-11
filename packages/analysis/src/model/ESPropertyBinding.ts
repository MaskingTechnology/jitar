
import ESBinding from './ESBinding';

export default class ESPropertyBinding extends ESBinding
{
    property: string;
    identifier: string;
    isRest: boolean;

    constructor(property: string, identifier: string, isRest = false)
    {
        super();

        this.property = property;
        this.identifier = identifier;
        this.isRest = isRest;
    }

    clone(): ESPropertyBinding
    {
        return new ESPropertyBinding(this.property, this.identifier, this.isRest);
    }

    toString(): string
    {
        const prefix = this.isRest ? '...' : '';

        if (this.property === this.identifier)
        {
            return `${prefix}${this.identifier}`;
        }

        return `${prefix}${this.property}:${this.identifier}`;
    }
}
