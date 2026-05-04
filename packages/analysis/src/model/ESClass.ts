
import type ESClassMember from './ESClassMember';
import ESConstructor from './ESConstructor';
import ESGetter from './ESGetter';
import ESSetter from './ESSetter';
import ESMethod from './ESMethod';
import ESField from './ESField';
import ESDeclaration from './ESDeclaration';

export default class ESClass extends ESDeclaration
{
    readonly #parent: string | undefined;
    readonly #members: ESClassMember[];

    constructor(identifier: string | undefined, parent: string | undefined, members: ESClassMember[])
    {
        super(identifier);

        this.#parent = parent;
        this.#members = members;
    }

    get parent() { return this.#parent; }

    get members() { return this.#members; }

    get construct() { return this.#members.find(member => member instanceof ESConstructor) }

    get getters() { return this.#members.filter(member => member instanceof ESGetter); }

    get setters() { return this.#members.filter(member => member instanceof ESSetter); }

    get methods() { return this.#members.filter(member => member instanceof ESMethod); }

    get fields() { return this.#members.filter(member => member instanceof ESField); }

    toString(): string
    {
        const infix = this.#parent !== undefined ? ` extends ${this.#parent}` : '';
        const members = this.#members.map(member => member.toString());

        return `class ${this.identifier}${infix} { ${members.join(' ')} }`;
    }
}
