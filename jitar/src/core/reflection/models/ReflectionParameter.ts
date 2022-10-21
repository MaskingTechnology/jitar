
export default class ReflectionParameter
{
    #name: string;
    #defaultValue?: string;

    constructor(name: string, defaultValue?: string)
    {
        this.#name = name;
        this.#defaultValue = defaultValue;
    }

    get name() { return this.#name; }

    get defaultValue() { return this.#defaultValue; }

    get isOptional() { return this.#defaultValue !== undefined; }
}
