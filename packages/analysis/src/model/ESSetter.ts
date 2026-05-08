
import type ESBlock from './ESBlock';
import type ESParameter from './ESParameter';
import type { Visibility, Location } from './ESClassMember';
import ESClassMember from './ESClassMember';

export default class ESSetter extends ESClassMember
{
    parameter: ESParameter;
    body: ESBlock;
    
    constructor(identifier: string, visibility: Visibility, location: Location, parameter: ESParameter, body: ESBlock)
    {
        super(identifier, visibility, location);

        this.parameter = parameter;
        this.body = body;
    }

    clone(): ESSetter
    {
        const parameter = this.parameter.clone();
        const body = this.body.clone();

        return new ESSetter(this.identifier, this.visibility, this.location, parameter, body);
    }

    toString(): string
    {
        const location = this.location === 'static' ? 'static ' : '';
        const visibility = this.visibility === 'private' ? '#' : '';
        const parameter = this.parameter.toString();
        const body = this.body.toString();

        return `${location}set ${visibility}${this.identifier}(${parameter})${body}`;
    }
}
