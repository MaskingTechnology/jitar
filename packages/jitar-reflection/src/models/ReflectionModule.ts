
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
}
