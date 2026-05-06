
import type ESBinding from './ESBinding';
import type ESStatement from './ESStatement';

export default class ESBindingElement
{
    binding: ESBinding;
    initializer: ESStatement | undefined;

    constructor(binding: ESBinding, initializer: ESStatement | undefined)
    {
        this.binding = binding;
        this.initializer = initializer;
    }

    clone(): ESBindingElement
    {
        const binding = this.binding.clone();
        const initializer = this.initializer?.clone();

        return new ESBindingElement(binding, initializer);
    }

    toString(): string
    {
        const binding = this.binding.toString();
        const initializer = this.initializer !== undefined ? `=${this.initializer.toString(false)}` : '';

        return `${binding}${initializer}`;
    }
}
