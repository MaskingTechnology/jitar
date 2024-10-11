
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

    toString(): string
    {
        return `import { ${this.#members.map(member => member.toString()).join(', ')} } from '${this.#from}';`;
    }
}
