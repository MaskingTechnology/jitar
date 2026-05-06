
import type ESBlock from './ESBlock';
import type ESParameter from './ESParameter';
import ESFunction from './ESFunction';

export default class ESArrowFunction extends ESFunction
{
    constructor(parameters: ESParameter[], body: ESBlock, isAsync = false)
    {
        super(undefined, parameters, body, isAsync);
    }

    toString(): string
    {
        const prefix = this.isAsync ? 'async ' : '';
        const parameters = this.parameters.map((parameter) => parameter.toString());
        const body = this.body.toString();

        return `${prefix}(${parameters.join(', ')})=>${body}`;
    }
}
