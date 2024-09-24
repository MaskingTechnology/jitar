
import ESFunction from './ESFunction.js';

export default class ESGenerator extends ESFunction
{
    toString(): string
    {
        const parameters = this.parameters.map((parameter) => parameter.toString());

        return `${this.isAsync ? 'async ' : ''}${this.name}*(${parameters.join(', ')}) { ${this.body} }`;
    }
}
