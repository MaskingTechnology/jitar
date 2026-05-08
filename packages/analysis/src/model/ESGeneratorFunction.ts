
import ESFunction from './ESFunction';

export default class ESGeneratorFunction extends ESFunction
{
    clone(): ESGeneratorFunction
    {
        const parameters = this.parameters.map(parameter => parameter.clone());
        const body = this.body.clone();

        return new ESGeneratorFunction(this.identifier, parameters, body, this.isAsync);
    }
    
    toString(): string
    {
        const prefix = this.isAsync ? 'async ' : '';
        const identifier = this.identifier ?? '';
        const parameters = this.parameters.map((parameter) => parameter.toString());
        const body = this.body.toString();

        return `${prefix}function* ${identifier}(${parameters.join(',')})${body}`;
    }
}
