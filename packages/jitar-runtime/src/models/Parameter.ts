
export default class Parameter
{
    #key: string;

    constructor(key: string)
    {
        this.#key = key;
    }

    get key() { return this.#key; }
}
