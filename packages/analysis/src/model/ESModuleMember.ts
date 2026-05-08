
export default class ESModuleMember
{
    identifier: string;
    alias?: string;

    constructor(identifier: string, alias?: string)
    {
        this.identifier = identifier;
        this.alias = alias;
    }

    is(identifier: string): boolean
    {
        return this.alias === identifier
            || (this.alias === undefined && this.identifier === identifier);
    }

    clone(): ESModuleMember
    {
        return new ESModuleMember(this.identifier, this.alias);
    }

    toString(): string
    {
        if (this.alias === undefined)
        {
            return this.identifier;
        }

        return `${this.identifier} as ${this.alias}`;
    }
}
