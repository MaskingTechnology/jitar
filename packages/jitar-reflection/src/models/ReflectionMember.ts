
export default class ReflectionMember
{
    #name: string;

    constructor(name: string)
    {
        this.#name = name;
    }

    get name(): string { return this.#name; }

    get isPublic(): boolean { return this.isPrivate === false; }

    get isPrivate(): boolean { return this.#name.startsWith('#'); }
}
