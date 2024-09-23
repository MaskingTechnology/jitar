
export default class Member
{
    #id: string;
    #importKey: string;
    #fqn: string;

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
