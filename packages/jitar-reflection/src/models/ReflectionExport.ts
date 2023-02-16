
import ReflectionAlias from './ReflectionAlias.js';
import ReflectionMember from './ReflectionMember.js';

export default class ReflectionExport extends ReflectionMember
{
    #members: ReflectionAlias[];
    #from: string | undefined;

    constructor(members: ReflectionAlias[], from: string | undefined)
    {
        super('');
        
        this.#members = members;
        this.#from = from;
    }

    get members() { return this.#members; }

    get from() { return this.#from; }
}
