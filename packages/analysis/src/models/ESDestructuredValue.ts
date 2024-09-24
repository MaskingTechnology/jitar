
import ESParameter from './ESParameter.js';

export default class ESDestructuredValue
{
    #members: ESParameter[];

    constructor(members: ESParameter[])
    {
        this.#members = members;
    }

    get members() { return this.#members; }

    toString(): string
    {
        return this.#members.map(member => member.toString()).join(' , ');
    }
}
