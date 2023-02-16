
export default class ReflectionValue
{
    #definition: string;

    constructor(definition: string)
    {
        this.#definition = definition;
    }

    get definition() { return this.#definition; }
}