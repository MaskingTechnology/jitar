
import ReflectionDeclaration from './ReflectionDeclaration.js';
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

    get declarations(): ReflectionDeclaration[] { return this.#scope.declarations; }

    get functions(): ReflectionFunction[] { return this.#scope.functions; }

    get getters(): ReflectionGetter[] { return this.#scope.getters; }

    get setters(): ReflectionSetter[] { return this.#scope.setters; }

    get generators(): ReflectionGenerator[] { return this.#scope.generators; }

    get readable(): Array<ReflectionDeclaration | ReflectionGetter>
    {
        const members = new Map<string, ReflectionDeclaration | ReflectionGetter>();

        this.getters.forEach(getter => { members.set(getter.name, getter); });
        this.declarations.forEach(declaration => { if(declaration.isPublic) members.set(declaration.name, declaration); });

        return [...members.values()];
    }

    get writable(): Array<ReflectionDeclaration | ReflectionSetter>
    {
        const members = new Map<string, ReflectionDeclaration | ReflectionSetter>();

        this.setters.forEach(setter => { members.set(setter.name, setter); });
        this.declarations.forEach(declaration => { if(declaration.isPublic) members.set(declaration.name, declaration); });

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

    getDeclaration(name: string): ReflectionDeclaration | undefined
    {
        return this.#scope.getDeclaration(name);
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

    hasDeclaration(name: string): boolean
    {
        return this.#scope.hasDeclaration(name);
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
        const declaration = this.getDeclaration(name);

        return (declaration !== undefined && declaration.isPublic)
            || this.hasGetter(name);
    }

    canWrite(name: string): boolean
    {
        const declaration = this.getDeclaration(name);
        
        return (declaration !== undefined && declaration.isPublic)
            || this.hasSetter(name);
    }

    canCall(name: string): boolean
    {
        const funktion = this.getFunction(name);

        return funktion !== undefined && funktion.isPublic;
    }

    toString(): string
    {
        const infix = this.#parentName !== undefined ? ` extends ${this.#parentName}` : '';

        return `class ${this.name}${infix} { ${this.#scope.toString()} }`;
    }
}
