
import Token from './Token.js';

export default class TokenList
{
    #tokens: Token[];
    #index: number;

    constructor(tokens: Token[])
    {
        this.#tokens = tokens;
        this.#index = 0;
    }

    get tokens() { return this.#tokens; }

    get index() { return this.#index; }

    get size() { return this.#tokens.length; }

    get eof() { return this.#index >= this.#tokens.length; }

    get current() { return this.#tokens[this.#index]; }

    get next() { return this.#tokens[this.#index + 1]; }

    get previous() { return this.#tokens[this.#index - 1]; }

    step(amount = 1) { this.#index += amount; }

    stepBack(amount = 1) { this.#index -= amount; }
}
