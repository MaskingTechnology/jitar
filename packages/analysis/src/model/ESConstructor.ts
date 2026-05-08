
import type ESBlock from './ESBlock';
import type ESParameter from './ESParameter';
import ESClassMember from './ESClassMember';

export default class ESConstructor extends ESClassMember
{
    parameters: ESParameter[];
    body: ESBlock;
    
    constructor(parameters: ESParameter[], body: ESBlock)
    {
        super('constructor', 'public', 'instance');

        this.parameters = parameters;
        this.body = body;
    }

    clone(): ESConstructor
    {
        const parameters = this.parameters.map(parameter => parameter.clone());
        const body = this.body.clone();

        return new ESConstructor(parameters, body);
    }

    toString(): string
    {
        const parameters = this.parameters.map((parameter) => parameter.toString());
        const body = this.body.toString();

        return `${this.identifier}(${parameters.join(',')}) ${body}`;
    }
}
