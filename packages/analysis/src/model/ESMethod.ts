
import type ESBlock from './ESBlock';
import type ESParameter from './ESParameter';
import type { Visibility, Location } from './ESClassMember';
import ESClassMember from './ESClassMember';

export default class ESMethod extends ESClassMember
{
    parameters: ESParameter[];
    body: ESBlock;
    isAsync: boolean;

    constructor(identifier: string, visibility: Visibility, location: Location, parameters: ESParameter[], body: ESBlock, isAsync = false)
    {
        super(identifier, visibility, location);

        this.parameters = parameters;
        this.body = body;
        this.isAsync = isAsync;
    }

    clone(): ESMethod
    {
        const parameters = this.parameters.map(parameter => parameter.clone());
        const body = this.body.clone();

        return new ESMethod(this.identifier!, this.visibility, this.location, parameters, body, this.isAsync);
    }

    toString(): string
    {
        const location = this.location === 'static' ? 'static ' : '';
        const visibility = this.visibility === 'private' ? '#' : '';
        const prefix = this.isAsync ? 'async ' : '';
        const parameters = this.parameters.map((parameter) => parameter.toString());
        const body = this.body.toString();

        return `${location}${prefix}${visibility}${this.identifier}(${parameters.join(',')})${body}`;
    }
}
