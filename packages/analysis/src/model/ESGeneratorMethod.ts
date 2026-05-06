
import ESMethod from './ESMethod';

export default class ESGeneratorMethod extends ESMethod
{
    clone(): ESGeneratorMethod
    {
        const parameters = this.parameters.map(parameter => parameter.clone());
        const body = this.body.clone();

        return new ESGeneratorMethod(this.identifier!, this.visibility, this.location, parameters, body, this.isAsync);
    }

    toString(): string
    {
        const prefix = this.isAsync ? 'async ' : '';
        const identifier = this.identifier ?? '';
        const parameters = this.parameters.map((parameter) => parameter.toString());
        const body = this.body.toString();

        return `${prefix}*${identifier}(${parameters.join(',')})${body}`;
    }
}
