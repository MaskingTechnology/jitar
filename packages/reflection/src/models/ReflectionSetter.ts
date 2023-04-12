
import ReflectionFunction from './ReflectionFunction.js';

export default class ReflectionSetter extends ReflectionFunction
{
    toString(): string
    {
        return `set ${super.toString()}`;
    }
}
