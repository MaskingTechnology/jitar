
export type Visibility = 'public' | 'private';
export type Location = 'instance' | 'static';

export default abstract class ESClassMember
{
    readonly #identifier: string;
    readonly #visibility: Visibility;
    readonly #location: Location;

    constructor(identifier: string, visibility: Visibility, location: Location)
    {
        this.#identifier = identifier;
        this.#visibility = visibility;
        this.#location = location;
    }

    get identifier() { return this.#identifier; }

    get visibility() { return this.#visibility; }

    get location() { return this.#location; }

    abstract toString(): string;
}
