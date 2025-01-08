
import ESClass from './ESClass.js';
import ESDeclaration from './ESDeclaration.js';
import ESExport from './ESExport.js';
import ESFunction from './ESFunction.js';
import ESGenerator from './ESGenerator.js';
import ESImport from './ESImport.js';
import ESMember from './ESMember.js';
import ESScope from './ESScope.js';

export default class ESModule
{
    readonly #scope: ESScope;

    constructor(scope: ESScope)
    {
        this.#scope = scope;
    }

    get scope(): ESScope { return this.#scope; }

    get members(): ESMember[] { return this.#scope.members; }

    get exportedMembers(): ESMember[] { return this.#filterExported(this.#scope.members); }

    get imports(): ESImport[] { return this.#scope.imports; }

    get exports(): ESExport[] { return this.#scope.exports; }

    get declarations(): ESDeclaration[] { return this.#scope.declarations; }

    get exportedDeclarations(): ESDeclaration[] { return this.#filterExported(this.#scope.declarations) as ESDeclaration[]; }

    get functions(): ESFunction[] { return this.#scope.functions; }

    get exportedFunctions(): ESFunction[] { return this.#filterExported(this.#scope.functions) as ESFunction[]; }

    get generators(): ESFunction[] { return this.#scope.generators; }

    get exportedGenerators(): ESGenerator[] { return this.#filterExported(this.#scope.generators) as ESGenerator[]; }

    get classes(): ESClass[] { return this.#scope.classes; }

    get exportedClasses(): ESClass[] { return this.#filterExported(this.#scope.classes) as ESClass[]; }

    get exported(): Map<string, ESMember>
    {
        const exported = new Map<string, ESMember>();
        
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

    getGenerator(name: string): ESFunction | undefined
    {
        return this.#scope.getGenerator(name);
    }

    getClass(name: string): ESClass | undefined
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

    getImport(name: string): ESImport | undefined
    {
        return this.imports.find(importItem => importItem.hasMember(name));
    }

    getImported(name: string): ESMember | undefined
    {
        for (const importItem of this.imports)
        {
            for (const alias of importItem.members)
            {
                if (alias.as === name)
                {
                    return this.getMember(alias.name);
                }
            }
        }

        return undefined;
    }

    isExported(member: ESMember): boolean
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

    getExport(name: string): ESExport | undefined
    {
        return this.exports.find(exportItem => exportItem.hasMember(name));
    }

    getExported(name: string): ESMember | undefined
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

    #filterExported(members: ESMember[]): ESMember[]
    {
        return members.filter(member => this.isExported(member));
    }
}
