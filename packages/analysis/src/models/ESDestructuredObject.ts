
import ESDestructuredValue from './ESDestructuredValue.js';

export default class ESDestructuredObject extends ESDestructuredValue
{
    toString(): string
    {
        return `{ ${super.toString()} }`;
    }
}
