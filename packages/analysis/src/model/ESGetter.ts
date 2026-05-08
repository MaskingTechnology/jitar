
import type ESBlock from './ESBlock';
import type { Visibility, Location } from './ESClassMember';
import ESClassMember from './ESClassMember';

export default class ESGetter extends ESClassMember
{
    body: ESBlock;
    
    constructor(identifier: string, visibility: Visibility, location: Location, body: ESBlock)
    {
        super(identifier, visibility, location);

        this.body = body;
    }

    clone(): ESGetter
    {
        const body = this.body.clone();

        return new ESGetter(this.identifier, this.visibility, this.location, body);
    }
    
    toString(): string
    {
        const location = this.location === 'static' ? 'static ' : '';
        const visibility = this.visibility === 'private' ? '#' : '';
        const body = this.body.toString();

        return `${location}get ${visibility}${this.identifier}()${body}`;
    }
}
