
export default class Reader
{
    #code: string;
    #position: number;

    constructor(code: string, position = 0)
    {
        this.#code = code;
        this.#position = position;
    }

    get code() { return this.#code; }

    get position() { return this.#position; }

    get size() { return this.#code.length; }

    get remaining() { return this.#code.length - this.#position; }

    get eof() { return this.#position >= this.#code.length; }

    get current() { return this.#code[this.#position]; }

    get next() { return this.#code[this.#position + 1]; }

    get previous() { return this.#code[this.#position - 1]; }

    step(amount = 1) { this.#position += amount; }

    stepBack(amount = 1) { this.#position -= amount; }
}
