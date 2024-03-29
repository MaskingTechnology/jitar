
import ReflectionClass from './ReflectionClass.js';
import ReflectionDeclaration from './ReflectionDeclaration.js';
import ReflectionExport from './ReflectionExport.js';
import ReflectionFunction from './ReflectionFunction.js';
import ReflectionGenerator from './ReflectionGenerator.js';
import ReflectionImport from './ReflectionImport.js';
import ReflectionMember from './ReflectionMember.js';
import ReflectionScope from './ReflectionScope.js';

export default class ReflectionModule
{
    #scope: ReflectionScope;

    constructor(scope: ReflectionScope)
    {
        this.#scope = scope;
    }

    get scope(): ReflectionScope { return this.#scope; }

    get members(): ReflectionMember[] { return this.#scope.members; }

    get exportedMembers(): ReflectionMember[] { return this.#filterExported(this.#scope.members); }

    get imports(): ReflectionImport[] { return this.#scope.imports; }

    get exports(): ReflectionExport[] { return this.#scope.exports; }

    get declarations(): ReflectionDeclaration[] { return this.#scope.declarations; }

    get exportedDeclarations(): ReflectionDeclaration[] { return this.#filterExported(this.#scope.declarations) as ReflectionDeclaration[]; }

    get functions(): ReflectionFunction[] { return this.#scope.functions; }

    get exportedFunctions(): ReflectionFunction[] { return this.#filterExported(this.#scope.functions) as ReflectionFunction[]; }

    get generators(): ReflectionFunction[] { return this.#scope.generators; }

    get exportedGenerators(): ReflectionGenerator[] { return this.#filterExported(this.#scope.generators) as ReflectionGenerator[]; }

    get classes(): ReflectionClass[] { return this.#scope.classes; }

    get exportedClasses(): ReflectionClass[] { return this.#filterExported(this.#scope.classes) as ReflectionClass[]; }

    get exported(): Map<string, ReflectionMember>
    {
        const exported = new Map<string, ReflectionMember>();
        
        for (const exportItem of this.exports)
        {
            for (const alias of exportItem.members)
            {
                const member = this.getMember(alias.name);

                if (member !== undefined)
                {
                    exported.set(alias.as, member);
                }
            }
        }

        return exported;
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

    getGenerator(name: string): ReflectionFunction | undefined
    {
        return this.#scope.getGenerator(name);
    }

    getClass(name: string): ReflectionClass | undefined
    {
        return this.#scope.getClass(name);
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

    hasGenerator(name: string): boolean
    {
        return this.#scope.hasGenerator(name);
    }

    hasClass(name: string): boolean
    {
        return this.#scope.hasClass(name);
    }

    isExported(member: ReflectionMember): boolean
    {
        for (const exportItem of this.exports)
        {
            for (const alias of exportItem.members)
            {
                if (alias.name === member.name)
                {
                    return true;
                }
            }
        }

        return false;
    }

    getExported(name: string): ReflectionMember | undefined
    {
        for (const exportItem of this.exports)
        {
            for (const alias of exportItem.members)
            {
                if (alias.as === name)
                {
                    return this.getMember(alias.name);
                }
            }
        }

        return undefined;
    }

    #filterExported(members: ReflectionMember[]): ReflectionMember[]
    {
        return members.filter(member => this.isExported(member));
    }
}
