
export default class Configuration
{
    #source: string;

    #target: string;

    constructor(source: string, target: string)
    {
        this.#source = source;
        this.#target = target;
    }

    get source() { return this.#source; }

    get target() { return this.#target; }
}
