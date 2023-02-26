
import ReflectionAlias from './ReflectionAlias.js';
import ReflectionMember from './ReflectionMember.js';

export default class ReflectionImport extends ReflectionMember
{
    #members: ReflectionAlias[];
    #from: string;

    constructor(members: ReflectionAlias[], from: string)
    {
        super('');
        
        this.#members = members;
        this.#from = from;
    }

    get members() { return this.#members; }

    get from() { return this.#from; }

    toString(): string
    {
        return `import { ${this.#members.map(member => member.toString()).join(', ')} } from '${this.#from}';`;
    }
}
