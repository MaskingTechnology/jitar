
import type ESModuleMember from './ESModuleMember.js';
import ESStatement from './ESStatement.js';

export default class ESExport extends ESStatement
{
    members: ESModuleMember[];
    from: string | undefined;

    constructor(members: ESModuleMember[], from: string | undefined)
    {
        super();
        
        this.members = members;
        this.from = from;
    }

    hasMember(identifier: string): boolean
    {
        return this.members.some(member => member.is(identifier));
    }

    getMember(identifier: string): ESModuleMember | undefined
    {
        return this.members.find(member => member.is(identifier));
    }

    clone(): ESExport
    {
        const members = this.members.map(member => member.clone());

        return new ESExport(members, this.from);
    }

    toString(): string
    {
        const members = this.members.map(member => member.toString());
        const postfix = this.from ? ` from '${this.from}'` : '';

        return `export {${members.join(',')}}${postfix};`;
    }
}
