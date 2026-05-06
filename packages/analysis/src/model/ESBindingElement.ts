
import type ESBinding from './ESBinding';
import type ESStatement from './ESStatement';

export default class ESBindingElement
{
    readonly #binding: ESBinding;
    readonly #initializer: ESStatement | undefined;

    constructor(binding: ESBinding, initializer: ESStatement | undefined)
    {
        this.#binding = binding;
        this.#initializer = initializer;
    }

    get binding() { return this.#binding; }

    get initializer() { return this.#initializer; }

    toString(): string
    {
        const binding = this.#binding.toString();
        const initializer = this.#initializer !== undefined ? `=${this.#initializer.toString(false)}` : '';

        return `${binding}${initializer}`;
    }
}
