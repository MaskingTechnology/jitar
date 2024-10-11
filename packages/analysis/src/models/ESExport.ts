
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

    toString(): string
    {
        const postfix = this.#from ? ` from '${this.#from}'` : '';

        return `export { ${this.#members.join(', ')} }${postfix}`;
    }
}
