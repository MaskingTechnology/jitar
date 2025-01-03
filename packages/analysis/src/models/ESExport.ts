
import ESAlias from './ESAlias.js';
import ESMember from './ESMember.js';

export default class ESExport extends ESMember
{
    readonly #members: ESAlias[];
    readonly #from: string | undefined;

    constructor(members: ESAlias[], from: string | undefined)
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
        const postfix = this.#from ? ` from '${this.#from}'` : '';

        return `export { ${this.#members.join(', ')} }${postfix}`;
    }
}
