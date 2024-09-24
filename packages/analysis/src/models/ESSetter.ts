
import ESFunction from './ESFunction.js';

export default class ESSetter extends ESFunction
{
    toString(): string
    {
        return `set ${super.toString()}`;
    }
}
