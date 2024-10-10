
import type Implementation from './Implementation';

export default class Procedure
{
    readonly #fqn: string;
    readonly #implementations: Implementation[] = [];

    constructor(fqn: string, implementations: Implementation[] = [])
    {
        this.#fqn = fqn;
        this.#implementations = implementations;
    }

    get fqn() { return this.#fqn; }

    get implementations() { return this.#implementations; }

    addImplementation(implementation: Implementation): void
    {
        this.#implementations.push(implementation);
    }
}
