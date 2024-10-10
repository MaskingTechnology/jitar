
export default class ESMember
{
    readonly #name: string;
    readonly #isStatic: boolean;
    readonly #isPrivate: boolean;

    constructor(name: string, isStatic = false, isPrivate = false)
    {
        this.#name = name;
        this.#isStatic = isStatic;
        this.#isPrivate = isPrivate;
    }

    get name() { return this.#name; }

    get isStatic() { return this.#isStatic; }

    get isPrivate() { return this.#isPrivate; }

    get isPublic() { return this.#isPrivate === false; }
}
