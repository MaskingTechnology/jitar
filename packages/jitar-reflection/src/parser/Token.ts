
export default class Token
{
    #type: string;
    #value: string;
    #start: number;
    #end: number;

    constructor(type: string, value: string, start: number, end: number)
    {
        this.#type = type;
        this.#value = value;
        this.#start = start;
        this.#end = end;
    }

    get type() { return this.#type; }

    get value() { return this.#value; }

    get start() { return this.#start; }

    get end() { return this.#end; }

    isType(type: string): boolean
    {
        return this.#type === type;
    }

    hasValue(value: string): boolean
    {
        return this.#value === value;
    }

    toString(): string
    {
        return `${this.#value} `;
    }
}
