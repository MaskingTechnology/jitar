
import ESFunction from './ESFunction';

export default class ESGeneratorFunction extends ESFunction
{
    toString(): string
    {
        const prefix = this.isAsync ? 'async ' : '';
        const identifier = this.identifier ?? '';
        const parameters = this.parameters.map((parameter) => parameter.toString());
        const body = this.body.toString();

        return `${prefix}function* ${identifier}(${parameters.join(',')})${body}`;
    }
}
