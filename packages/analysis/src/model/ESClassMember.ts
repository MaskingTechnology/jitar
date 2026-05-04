
import ESDeclaration from './ESDeclaration';

export type Visibility = 'public' | 'private';
export type Location = 'instance' | 'static';

export default abstract class ESClassMember extends ESDeclaration
{
    readonly #visibility: Visibility;
    readonly #location: Location;

    constructor(identifier: string, visibility: Visibility, location: Location)
    {
        super(identifier);
        
        this.#visibility = visibility;
        this.#location = location;
    }

    get visibility() { return this.#visibility; }

    get location() { return this.#location; }

    abstract toString(): string;
}
