
import ESMethod from './ESMethod';

export default class ESGeneratorMethod extends ESMethod
{
    toString(): string
    {
        const prefix = this.isAsync ? 'async ' : '';
        const identifier = this.identifier ?? '';
        const parameters = this.parameters.map((parameter) => parameter.toString());
        const body = this.body.toString();

        return `${prefix}*${identifier}(${parameters.join(', ')}) ${body}`;
    }
}
