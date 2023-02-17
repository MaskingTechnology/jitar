
import ReflectionClass from './ReflectionClass.js';
import ReflectionExport from './ReflectionExport.js';
import ReflectionField from './ReflectionField.js';
import ReflectionFunction from './ReflectionFunction.js';
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

    get imports(): ReflectionImport[] { return this.#scope.imports; }

    get exports(): ReflectionExport[] { return this.#scope.exports; }

    get fields(): ReflectionField[] { return this.#scope.fields; }

    get functions(): ReflectionFunction[] { return this.#scope.functions; }

    get generators(): ReflectionFunction[] { return this.#scope.generators; }

    get classes(): ReflectionClass[] { return this.#scope.classes; }

    get exported(): ReflectionMember[]
    {
        const members = [];
        
        for (const exported of this.#scope.exports)
        {
            for (const member of exported.members)
            {
                members.push(this.#scope.getMember(member.name));
            }
        }

        return members.filter(member => member !== undefined) as ReflectionMember[];
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
}
