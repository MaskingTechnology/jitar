
import ReflectionMember from './ReflectionMember.js';
import ReflectionScope from './ReflectionScope.js';

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
}
