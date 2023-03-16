
import ReflectionParameter from './ReflectionParameter.js';

export default class ReflectionDestructuredValue
{
    #members: ReflectionParameter[];

    constructor(members: ReflectionParameter[])
    {
        this.#members = members;
    }

    get members() { return this.#members; }

    toString(): string
    {
        return this.#members.map(member => member.toString()).join(' , ');
    }
}
