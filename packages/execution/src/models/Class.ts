
export default class Class
{
    readonly #fqn: string;
    readonly #implementation: Function;

    constructor(fqn: string, implementation: Function)
    {
        this.#fqn = fqn;
        this.#implementation = implementation;
    }

    get fqn() { return this.#fqn; }

    get implementation() { return this.#implementation; }
}
