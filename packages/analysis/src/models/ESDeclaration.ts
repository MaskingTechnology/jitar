
import ESIdentifier from './ESIdentifier.js';
import ESMember from './ESMember.js';
import ESValue from './ESValue.js';

export default class ESDeclaration extends ESMember
{
    #identifier: ESIdentifier;
    #value: ESValue | undefined;

    constructor(identifier: ESIdentifier, value: ESValue | undefined, isStatic = false, isPrivate = false)
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
