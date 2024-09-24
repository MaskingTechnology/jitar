
import ESDeclaration from './ESDeclaration.js';
import ESFunction from './ESFunction.js';
import ESGenerator from './ESGenerator.js';
import ESGetter from './ESGetter.js';
import ESMember from './ESMember.js';
import ESScope from './ESScope.js';
import ESSetter from './ESSetter.js';

export default class ESClass extends ESMember
{
    #parentName: string | undefined;
    #scope: ESScope;

    constructor(name: string, parentName: string | undefined, scope: ESScope)
    {
        super(name);

        this.#parentName = parentName;
        this.#scope = scope;
    }

    get parentName(): string | undefined { return this.#parentName; }

    get scope(): ESScope { return this.#scope; }

    get members(): ESMember[] { return this.#scope.members; }

    get declarations(): ESDeclaration[] { return this.#scope.declarations; }

    get functions(): ESFunction[] { return this.#scope.functions; }

    get getters(): ESGetter[] { return this.#scope.getters; }

    get setters(): ESSetter[] { return this.#scope.setters; }

    get generators(): ESGenerator[] { return this.#scope.generators; }

    get readable(): Array<ESDeclaration | ESGetter>
    {
        const members = new Map<string, ESDeclaration | ESGetter>();

        this.getters.forEach(getter => { members.set(getter.name, getter); });
        this.declarations.forEach(declaration => { if(declaration.isPublic) members.set(declaration.name, declaration); });

        return [...members.values()];
    }

    get writable(): Array<ESDeclaration | ESSetter>
    {
        const members = new Map<string, ESDeclaration | ESSetter>();

        this.setters.forEach(setter => { members.set(setter.name, setter); });
        this.declarations.forEach(declaration => { if(declaration.isPublic) members.set(declaration.name, declaration); });

        return [...members.values()];
    }

    get callable(): ESFunction[]
    {
        return this.functions.filter(funktion => funktion.isPublic);
    }

    getMember(name: string): ESMember | undefined
    {
        return this.#scope.getMember(name);
    }

    getDeclaration(name: string): ESDeclaration | undefined
    {
        return this.#scope.getDeclaration(name);
    }

    getFunction(name: string): ESFunction | undefined
    {
        return this.#scope.getFunction(name);
    }

    getGetter(name: string): ESGetter | undefined
    {
        return this.#scope.getGetter(name);
    }

    getSetter(name: string): ESSetter | undefined
    {
        return this.#scope.getSetter(name);
    }

    getGenerator(name: string): ESGenerator | undefined
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
