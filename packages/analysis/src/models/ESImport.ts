
import ESAlias from './ESAlias.js';
import ESMember from './ESMember.js';

export default class ESImport extends ESMember
{
    readonly #members: ESAlias[];
    readonly #from: string;

    constructor(members: ESAlias[], from: string)
    {
        super('');
        
        this.#members = members;
        this.#from = from;
    }

    get members() { return this.#members; }

    get from() { return this.#from; }

    hasMember(name: string): boolean
    {
        return this.#members.some(member => member.as === name);
    }

    getMember(name: string): ESAlias | undefined
    {
        return this.#members.find(member => member.as === name);
    }

    toString(): string
    {
        return `import { ${this.#members.map(member => member.toString()).join(', ')} } from '${this.#from}';`;
    }
}
