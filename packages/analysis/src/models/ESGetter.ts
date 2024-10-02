
import ESFunction from './ESFunction.js';

export default class ESGetter extends ESFunction
{
    toString(): string
    {
        return `get ${super.toString()}`;
    }
}
