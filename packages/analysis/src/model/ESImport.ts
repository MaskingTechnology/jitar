
import type ESModuleMember from './ESModuleMember.js';
import ESStatement from './ESStatement.js';

export default class ESImport extends ESStatement
{
    readonly #members: ESModuleMember[];
    readonly #from: string;

    constructor(members: ESModuleMember[], from: string)
    {
        super();
        
        this.#members = members;
        this.#from = from;
    }

    get members() { return this.#members; }

    get from() { return this.#from; }

    hasMember(identifier: string): boolean
    {
        return this.#members.some(member => member.is(identifier));
    }

    getMember(identifier: string): ESModuleMember | undefined
    {
        return this.#members.find(member => member.is(identifier));
    }

    toString(): string
    {
        if (this.#members.length === 0)
        {
            return `import '${this.#from}';`;
        }
        
        const members = this.#members.map(member => member.toString());

        return `import { ${members.join(', ')} } from '${this.#from}';`;
    }
}
