
import ReflectionDestructuredValue from './ReflectionDestructuredValue.js';

export default class ReflectionDestructuredArray extends ReflectionDestructuredValue
{
    toString(): string
    {
        return `[ ${super.toString()} ]`;
    }
}
