
import type ESBlock from './ESBlock';
import type { Visibility, Location } from './ESClassMember';
import ESClassMember from './ESClassMember';

export default class ESGetter extends ESClassMember
{
    readonly #body: ESBlock;
    
    constructor(identifier: string, visibility: Visibility, location: Location, body: ESBlock)
    {
        super(identifier, visibility, location);

        this.#body = body;
    }

    get body() { return this.#body; }

    toString(): string
    {
        const location = this.location === 'static' ? 'static ' : '';
        const visibility = this.visibility === 'private' ? '#' : '';
        const body = this.#body.toString();

        return `${location}get ${visibility}${this.identifier}()${body}`;
    }
}
