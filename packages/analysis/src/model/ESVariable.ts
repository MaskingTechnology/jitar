
import type ESBinding from './ESBinding';
import type ESStatement from './ESStatement';
import ESDeclaration from './ESDeclaration';

export type Type = 'const' | 'let' | 'var';
export type Initializer = ESStatement | undefined;

export default class ESVariable extends ESDeclaration
{
    type: Type;
    binding: ESBinding;
    initializer: Initializer;

    constructor(type: Type, binding: ESBinding, initializer: Initializer)
    {
        super(binding.toString());
        
        this.type = type;
        this.binding = binding;
        this.initializer = initializer;
    }

    clone(): ESVariable
    {
        const binding = this.binding.clone();
        const initializer = this.initializer?.clone();

        return new ESVariable(this.type, binding, initializer);
    }

    toString(): string
    {
        const initializer = this.initializer !== undefined ? `=${this.initializer.toString(true)}` : '';
        const terminator = initializer.endsWith(';') ? '' : ';';

        return `${this.type} ${this.identifier}${initializer}${terminator}`;
    }
}
