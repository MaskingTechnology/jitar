
export default class ReflectionField
{
    #name: string;
    #canGet: boolean;
    #canSet: boolean;

    constructor(name: string, canGet: boolean, canSet: boolean)
    {
        this.#name = name;
        this.#canGet = canGet;
        this.#canSet = canSet;
    }

    get name() { return this.#name; }

    get canGet() { return this.#canGet; }

    get canSet() { return this.#canSet; }

    get canGetAndSet() { return this.#canGet && this.#canSet; }
}
