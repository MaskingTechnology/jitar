
import ESDestructuredValue from './ESDestructuredValue.js';

export default class ESDestructuredArray extends ESDestructuredValue
{
    toString(): string
    {
        return `[ ${super.toString()} ]`;
    }
}
