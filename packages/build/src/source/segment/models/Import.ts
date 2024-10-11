
export default class Import
{
    readonly #members: string[];
    readonly #from: string;

    constructor(members: string[], from: string)
    {
        this.#members = members;
        this.#from = from;
    }

    get members() { return this.#members; }

    get from() { return this.#from; }
}
