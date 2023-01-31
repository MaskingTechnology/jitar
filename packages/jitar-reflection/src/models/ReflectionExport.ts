
export default class ReflectionExport
{
    #name: string;
    #as: string;

    constructor(name: string, as: string)
    {
        this.#name = name;
        this.#as = as;
    }

    get name(): string { return this.#name; }

    get as(): string { return this.#as; }
}
