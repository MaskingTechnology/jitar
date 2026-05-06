
import type ESBindingElement from './ESBindingElement';
import ESBinding from './ESBinding';

export default class ESArrayBinding extends ESBinding
{
    elements: ESBindingElement[];

    constructor(elements: ESBindingElement[])
    {
        super();

        this.elements = elements;
    }

    clone(): ESArrayBinding
    {
        const elements = this.elements.map(element => element.clone());

        return new ESArrayBinding(elements);
    }

    toString(): string
    {
        const elements = this.elements.map(element => element.toString());

        return `[${elements.join(',')}]`;
    }
}
