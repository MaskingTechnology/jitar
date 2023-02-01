
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

    get fields(): ReflectionField[] { return this.#members.filter(member => member instanceof ReflectionField) as ReflectionField[]; }

    get functions(): ReflectionFunction[] { return this.#members.filter(member => member instanceof ReflectionFunction) as ReflectionFunction[]; }

    get getters(): ReflectionGetter[] { return this.#members.filter(member => member instanceof ReflectionGetter) as ReflectionGetter[]; }

    get setters(): ReflectionSetter[] { return this.#members.filter(member => member instanceof ReflectionSetter) as ReflectionSetter[]; }

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
}
