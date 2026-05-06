
import type ESStatement from './ESStatement';
import type { Visibility, Location } from './ESClassMember';
import ESClassMember from './ESClassMember';

export default class ESField extends ESClassMember
{
    initializer: ESStatement | undefined;

    constructor(identifier: string, visibility: Visibility, location: Location, initializer: ESStatement | undefined)
    {
        super(identifier, visibility, location);
        
        this.initializer = initializer;
    }

    clone(): ESField
    {
        const initializer = this.initializer?.clone();

        return new ESField(this.identifier!, this.visibility, this.location, initializer);
    }

    toString(): string
    {
        const location = this.location === 'static' ? 'static ' : '';
        const visibility = this.visibility === 'private' ? '#' : '';
        const initializer = this.initializer !== undefined ? `=${this.initializer.toString(true)}` : ';';

        return `${location}${visibility}${this.identifier}${initializer}`;
    }
}
