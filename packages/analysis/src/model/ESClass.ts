
import type ESClassMember from './ESClassMember';
import ESConstructor from './ESConstructor';
import ESGetter from './ESGetter';
import ESSetter from './ESSetter';
import ESMethod from './ESMethod';
import ESField from './ESField';
import ESDeclaration from './ESDeclaration';

export type ESReadableClassMember = ESField | ESGetter;
export type ESWritableClassMember = ESField | ESSetter;

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

    get construct() { return this.#members.find(member => member instanceof ESConstructor); }

    get fields() { return this.#members.filter(member => member instanceof ESField); }

    get getters() { return this.#members.filter(member => member instanceof ESGetter); }

    get setters() { return this.#members.filter(member => member instanceof ESSetter); }

    get methods() { return this.#members.filter(member => member instanceof ESMethod); }

    get publicFields() { return this.fields.filter(member => member.visibility === 'public' ); }

    get publicGetters() { return this.getters.filter(member => member.visibility === 'public' ); }

    get publicSetters() { return this.setters.filter(member => member.visibility === 'public' ); }

    get publicMethods() { return this.methods.filter(member => member.visibility === 'public' ); }

    get readable(): ESReadableClassMember[]
    {
        return [...this.publicFields, ...this.publicGetters];
    }

    get writable(): ESWritableClassMember[]
    {
        return [...this.publicFields, ...this.publicSetters];
    }

    getMember(identifier: string): ESClassMember | undefined
    {
        return this.members.find(member => member.is(identifier));
    }

    hasMember(identifier: string): boolean
    {
        return this.members.some(member => member.is(identifier));
    }

    getField(identifier: string): ESField | undefined
    {
        return this.fields.find(member => member.is(identifier));
    }

    hasField(identifier: string): boolean
    {
        return this.fields.some(member => member.is(identifier));
    }

    getGetter(identifier: string): ESGetter | undefined
    {
        return this.getters.find(member => member.is(identifier));
    }

    hasGetter(identifier: string): boolean
    {
        return this.getters.some(member => member.is(identifier));
    }

    getSetter(identifier: string): ESSetter | undefined
    {
        return this.setters.find(member => member.is(identifier));
    }

    hasSetter(identifier: string): boolean
    {
        return this.setters.some(member => member.is(identifier));
    }

    getMethod(identifier: string): ESMethod | undefined
    {
        return this.methods.find(member => member.is(identifier));
    }

    hasMethod(identifier: string): boolean
    {
        return this.methods.some(member => member.is(identifier));
    }

    canRead(identifier: string): boolean
    {
        return this.readable.some(member => member.is(identifier));
    }

    canWrite(identifier: string): boolean
    {
        return this.writable.some(member => member.is(identifier));
    }

    toString(): string
    {
        const identifier = this.identifier ?? '';
        const infix = this.#parent !== undefined ? ` extends ${this.#parent}` : '';
        const members = this.#members.map(member => member.toString());

        return `class ${identifier}${infix}{ ${members.join(' ')} }`;
    }
}
