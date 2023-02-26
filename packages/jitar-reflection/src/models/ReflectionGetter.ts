
import ReflectionFunction from './ReflectionFunction.js';

export default class ReflectionGetter extends ReflectionFunction
{
    toString(): string
    {
        return `get ${super.toString()}`;
    }
}
