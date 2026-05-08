
export type Visibility = 'public' | 'private';
export type Location = 'instance' | 'static';

export default abstract class ESClassMember
{
    identifier: string;
    visibility: Visibility;
    location: Location;

    constructor(identifier: string, visibility: Visibility, location: Location)
    {
        this.identifier = identifier;
        this.visibility = visibility;
        this.location = location;
    }

    is(identifier: string): boolean
    {
        return this.identifier === identifier;
    }

    abstract clone(): ESClassMember;

    abstract toString(): string;
}
