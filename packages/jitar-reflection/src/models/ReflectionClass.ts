
import ReflectionField from './ReflectionField.js';
import ReflectionFunction from './ReflectionFunction.js';
import ReflectionGetter from './ReflectionGetter.js';
import ReflectionMember from './ReflectionMember.js';
import ReflectionSetter from './ReflectionSetter.js';

export default class ReflectionClass extends ReflectionMember
{
    #parentName: string | undefined;
    #members: ReflectionMember[];

    constructor(name: string, parentName: string | undefined, members: ReflectionMember[])
    {
        super(name);

        this.#parentName = parentName;
        this.#members = members;
    }

    get parentName(): string | undefined { return this.#parentName; }

    get members(): ReflectionMember[] { return this.#members; }

    get fields(): ReflectionField[] { return this.#members.filter(member => member.constructor.name === 'ReflectionField') as ReflectionField[]; }

    get functions(): ReflectionFunction[] { return this.#members.filter(member => member.constructor.name === 'ReflectionFunction') as ReflectionFunction[]; }

    get getters(): ReflectionGetter[] { return this.#members.filter(member => member.constructor.name === 'ReflectionGetter') as ReflectionGetter[]; }

    get setters(): ReflectionSetter[] { return this.#members.filter(member => member.constructor.name === 'ReflectionSetter') as ReflectionSetter[]; }

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

    canRead(name: string): boolean
    {
        const field = this.getField(name);

        return (field !== undefined && field.isPublic)
            || this.hasGetter(name);
    }

    canWrite(name: string): boolean
    {
        const field = this.getField(name);
        
        return (field !== undefined && field.isPublic)
            || this.hasSetter(name);
    }

    canCall(name: string): boolean
    {
        const funktion = this.getFunction(name);

        return funktion !== undefined && funktion.isPublic;
    }
}
