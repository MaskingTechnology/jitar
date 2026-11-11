
import ESBinding from './ESBinding';

export default class ESPropertyBinding extends ESBinding
{
    property: string;
    identifier: string;

    constructor(property: string, identifier: string)
    {
        super();

        this.property = property;
        this.identifier = identifier;
    }

    clone(): ESPropertyBinding
    {
        return new ESPropertyBinding(this.property, this.identifier);
    }

    toString(): string
    {
        return this.property === this.identifier
            ? this.identifier
            : `${this.property}:${this.identifier}`;
    }
}
