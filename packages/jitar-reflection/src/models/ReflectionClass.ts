
import ReflectionField from './ReflectionField.js';
import ReflectionFunction from './ReflectionFunction.js';
import ReflectionGenerator from './ReflectionGenerator.js';
import ReflectionGetter from './ReflectionGetter.js';
import ReflectionMember from './ReflectionMember.js';
import ReflectionScope from './ReflectionScope.js';
import ReflectionSetter from './ReflectionSetter.js';

export default class ReflectionClass extends ReflectionMember
{
    #parentName: string | undefined;
    #scope: ReflectionScope;

    constructor(name: string, parentName: string | undefined, scope: ReflectionScope)
    {
        super(name);

        this.#parentName = parentName;
        this.#scope = scope;
    }

    get parentName(): string | undefined { return this.#parentName; }

    get scope(): ReflectionScope { return this.#scope; }

    get members(): ReflectionMember[] { return this.#scope.members; }

    get fields(): ReflectionField[] { return this.#scope.fields; }

    get functions(): ReflectionFunction[] { return this.#scope.functions; }

    get getters(): ReflectionGetter[] { return this.#scope.getters; }

    get setters(): ReflectionSetter[] { return this.#scope.setters; }

    get generators(): ReflectionGenerator[] { return this.#scope.generators; }

    get readable(): Array<ReflectionField | ReflectionGetter>
    {
        const members = new Map<string, ReflectionField | ReflectionGetter>();

        this.getters.forEach(getter => { members.set(getter.name, getter) });
        this.fields.forEach(field => { if(field.isPublic) members.set(field.name, field); });

        return [...members.values()];
    }

    get writable(): Array<ReflectionField | ReflectionSetter>
    {
        const members = new Map<string, ReflectionField | ReflectionSetter>();

        this.setters.forEach(setter => { members.set(setter.name, setter) });
        this.fields.forEach(field => { if(field.isPublic) members.set(field.name, field); });

        return [...members.values()];
    }

    get callable(): ReflectionFunction[]
    {
        return this.functions.filter(funktion => funktion.isPublic);
    }

    getMember(name: string): ReflectionMember | undefined
    {
        return this.#scope.getMember(name);
    }

    getField(name: string): ReflectionField | undefined
    {
        return this.#scope.getField(name);
    }

    getFunction(name: string): ReflectionFunction | undefined
    {
        return this.#scope.getFunction(name);
    }

    getGetter(name: string): ReflectionGetter | undefined
    {
        return this.#scope.getGetter(name);
    }

    getSetter(name: string): ReflectionSetter | undefined
    {
        return this.#scope.getSetter(name);
    }

    getGenerator(name: string): ReflectionGenerator | undefined
    {
        return this.#scope.getGenerator(name);
    }

    hasMember(name: string): boolean
    {
        return this.#scope.hasMember(name);
    }

    hasField(name: string): boolean
    {
        return this.#scope.hasField(name);
    }

    hasFunction(name: string): boolean
    {
        return this.#scope.hasFunction(name);
    }

    hasGetter(name: string): boolean
    {
        return this.#scope.hasGetter(name);
    }

    hasSetter(name: string): boolean
    {
        return this.#scope.hasSetter(name);
    }

    hasGenerator(name: string): boolean
    {
        return this.#scope.hasGenerator(name);
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
