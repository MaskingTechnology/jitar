
import ReflectionMember from './ReflectionMember.js';
import ReflectionGetter from './ReflectionGetter.js';
import ReflectionSetter from './ReflectionSetter.js';
import ReflectionFunction from './ReflectionFunction.js';
import ReflectionClass from './ReflectionClass.js';
import ReflectionField from './ReflectionField.js';
import ReflectionImport from './ReflectionImport.js';
import ReflectionExport from './ReflectionExport.js';
import ReflectionGenerator from './ReflectionGenerator.js';

export default class ReflectionScope
{
    #members: ReflectionMember[];

    constructor(members: ReflectionMember[])
    {
        this.#members = members;
    }

    // The constructor name is used to determine the type of the member.
    // This makes sure that the member is of the exact type and not a subclass.

    get members(): ReflectionMember[] { return this.#members; }

    get imports(): ReflectionImport[] { return this.#members.filter(member => member.constructor.name === 'ReflectionImport') as ReflectionImport[]; }

    get exports(): ReflectionExport[] { return this.#members.filter(member => member.constructor.name === 'ReflectionExport') as ReflectionExport[]; }

    get fields(): ReflectionField[] { return this.#members.filter(member => member.constructor.name === 'ReflectionField') as ReflectionField[]; }

    get functions(): ReflectionFunction[] { return this.#members.filter(member => member.constructor.name === 'ReflectionFunction') as ReflectionFunction[]; }

    get getters(): ReflectionGetter[] { return this.#members.filter(member => member.constructor.name === 'ReflectionGetter') as ReflectionGetter[]; }

    get setters(): ReflectionSetter[] { return this.#members.filter(member => member.constructor.name === 'ReflectionSetter') as ReflectionSetter[]; }

    get generators(): ReflectionGenerator[] { return this.#members.filter(member => member.constructor.name === 'ReflectionGenerator') as ReflectionGenerator[]; }

    get classes(): ReflectionClass[] { return this.#members.filter(member => member.constructor.name === 'ReflectionClass') as ReflectionClass[]; }

    getMember(name: string): ReflectionMember | undefined
    {
        return this.#members.find(member => member.name === name);
    }

    getField(name: string): ReflectionField | undefined
    {
        return this.fields.find(member => member.name === name);
    }

    getFunction(name: string): ReflectionFunction | undefined
    {
        return this.functions.find(member => member.name === name);
    }

    getGetter(name: string): ReflectionGetter | undefined
    {
        return this.getters.find(member => member.name === name);
    }

    getSetter(name: string): ReflectionSetter | undefined
    {
        return this.setters.find(member => member.name === name);
    }

    getGenerator(name: string): ReflectionGenerator | undefined
    {
        return this.generators.find(member => member.name === name);
    }

    getClass(name: string): ReflectionClass | undefined
    {
        return this.classes.find(member => member.name === name);
    }

    hasMember(name: string): boolean
    {
        return this.getMember(name) !== undefined;
    }

    hasField(name: string): boolean
    {
        return this.getField(name) !== undefined;
    }

    hasFunction(name: string): boolean
    {
        return this.getFunction(name) !== undefined;
    }

    hasGetter(name: string): boolean
    {
        return this.getGetter(name) !== undefined;
    }

    hasSetter(name: string): boolean
    {
        return this.getSetter(name) !== undefined;
    }

    hasGenerator(name: string): boolean
    {
        return this.getGenerator(name) !== undefined;
    }

    hasClass(name: string): boolean
    {
        return this.getClass(name) !== undefined;
    }
}
