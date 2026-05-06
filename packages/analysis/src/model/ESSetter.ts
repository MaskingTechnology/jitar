
import type ESBlock from './ESBlock';
import type ESParameter from './ESParameter';
import type { Visibility, Location } from './ESClassMember';
import ESClassMember from './ESClassMember';

export default class ESSetter extends ESClassMember
{
    readonly #parameter: ESParameter;
    readonly #body: ESBlock;
    
    constructor(identifier: string, visibility: Visibility, location: Location, parameter: ESParameter, body: ESBlock)
    {
        super(identifier, visibility, location);

        this.#parameter = parameter;
        this.#body = body;
    }

    get parameter() { return this.#parameter; }

    get body() { return this.#body; }

    toString(): string
    {
        const location = this.location === 'static' ? 'static ' : '';
        const visibility = this.visibility === 'private' ? '#' : '';
        const parameter = this.#parameter.toString();
        const body = this.#body.toString();

        return `${location}set ${visibility}${this.identifier}(${parameter})${body}`;
    }
}
