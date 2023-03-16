
import ReflectionDestructuredValue from './ReflectionDestructuredValue.js';

export default class ReflectionDestructuredObject extends ReflectionDestructuredValue
{
    toString(): string
    {
        return `{ ${super.toString()} }`;
    }
}
