
import ReflectionClass from './ReflectionClass.js';
import ReflectionExport from './ReflectionExport.js';
import ReflectionField from './ReflectionField.js';
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

    get fields(): ReflectionField[] { return this.#scope.fields; }

    get exportedFields(): ReflectionField[] { return this.#filterExported(this.#scope.fields) as ReflectionField[]; }

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

    getField(name: string): ReflectionField | undefined
    {
        return this.#scope.getField(name);
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
        return this.#scope.getMember(name) !== undefined;
    }

    hasField(name: string): boolean
    {
        return this.#scope.getField(name) !== undefined;
    }

    hasFunction(name: string): boolean
    {
        return this.#scope.getFunction(name) !== undefined;
    }

    hasGenerator(name: string): boolean
    {
        return this.#scope.getGenerator(name) !== undefined;
    }

    hasClass(name: string): boolean
    {
        return this.#scope.getClass(name) !== undefined;
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
