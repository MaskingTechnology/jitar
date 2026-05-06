
import type ESBinding from './ESBinding';
import type ESStatement from './ESStatement';
import ESDeclaration from './ESDeclaration';

export type Type = 'const' | 'let' | 'var';
export type Initializer = ESStatement | undefined;

export default class ESVariable extends ESDeclaration
{
    readonly #type: Type;
    readonly #binding: ESBinding;
    readonly #initializer: Initializer;

    constructor(type: Type, binding: ESBinding, initializer: Initializer)
    {
        super(binding.toString());
        
        this.#type = type;
        this.#binding = binding;
        this.#initializer = initializer;
    }

    get type() { return this.#type; }

    get binding() { return this.#binding; }

    get initializer() { return this.#initializer; }

    toString(): string
    {
        const initializer = this.#initializer !== undefined ? `=${this.#initializer.toString(true)}` : '';
        const terminator = initializer.endsWith(';') ? '' : ';';

        return `${this.#type} ${this.identifier}${initializer}${terminator}`;
    }
}
