
export default class Member
{
    readonly #id: string;
    readonly #importKey: string;
    readonly #fqn: string;

    public constructor(id: string, importKey: string, fqn: string)
    {
        this.#id = id;
        this.#importKey = importKey;
        this.#fqn = fqn;
    }

    public get id() { return this.#id; }

    public get importKey() { return this.#importKey; }

    public get fqn() { return this.#fqn; }
}
