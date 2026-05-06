
import type ESBindingElement from './ESBindingElement';
import ESBinding from './ESBinding';

export default class ESArrayBinding extends ESBinding
{
    readonly #elements: ESBindingElement[];

    constructor(elements: ESBindingElement[])
    {
        super();

        this.#elements = elements;
    }

    get elements() { return this.#elements; }

    toString(): string
    {
        const elements = this.#elements.map(element => element.toString());

        return `[${elements.join(',')}]`;
    }
}
