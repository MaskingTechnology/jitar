
import type ESModuleMember from './ESModuleMember.js';
import ESStatement from './ESStatement.js';

export default class ESImport extends ESStatement
{
    members: ESModuleMember[];
    from: string;

    constructor(members: ESModuleMember[], from: string)
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

    clone(): ESImport
    {
        const members = this.members.map(member => member.clone());

        return new ESImport(members, this.from);
    }

    toString(): string
    {
        if (this.members.length === 0)
        {
            return `import '${this.from}';`;
        }
        
        const members = this.members.map(member => member.toString());

        return `import {${members.join(',')}} from '${this.from}';`;
    }
}
