
import ReflectionIdentifier from './ReflectionIdentifier.js';
import ReflectionMember from './ReflectionMember.js';
import ReflectionValue from './ReflectionValue.js';

export default class ReflectionDeclaration extends ReflectionMember
{
    #identifier: ReflectionIdentifier;
    #value: ReflectionValue | undefined;

    constructor(identifier: ReflectionIdentifier, value: ReflectionValue | undefined, isStatic = false, isPrivate = false)
    {
        super(identifier.toString(), isStatic, isPrivate);

        this.#identifier = identifier;
        this.#value = value;
    }

    get identifier() { return this.#identifier; }

    get value() { return this.#value; }

    toString(): string
    {
        return `${this.name}${this.value ? ' = ' + this.value.toString() : ''}`;
    }
}
