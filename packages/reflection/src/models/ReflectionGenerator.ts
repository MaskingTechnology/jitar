
import ReflectionFunction from './ReflectionFunction.js';

export default class ReflectionGenerator extends ReflectionFunction
{
    toString(): string
    {
        const parameters = this.parameters.map((parameter) => parameter.toString());

        return `${this.isAsync ? 'async ' : ''}${this.name}*(${parameters.join(', ')}) { ${this.body} }`;
    }
}
