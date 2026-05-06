
import type ESBindingElement from './ESBindingElement';
import ESBinding from './ESBinding';

export default class ESObjectBinding extends ESBinding
{
    elements: ESBindingElement[];

    constructor(elements: ESBindingElement[])
    {
        super();

        this.elements = elements;
    }

    clone(): ESObjectBinding
    {
        const elements = this.elements.map(element => element.clone());

        return new ESObjectBinding(elements);
    }

    toString(): string
    {
        const elements = this.elements.map(element => element.toString());

        return `{${elements.join(',')}}`;
    }
}
