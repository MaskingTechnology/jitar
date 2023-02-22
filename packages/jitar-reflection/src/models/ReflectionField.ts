
import ReflectionMember from './ReflectionMember.js';
import ReflectionValue from './ReflectionValue.js';

export default class ReflectionField extends ReflectionMember
{
    #value: ReflectionValue | undefined;

    constructor(name: string, value: ReflectionValue | undefined, isStatic = false, isPrivate = false)
    {
        super(name, isStatic, isPrivate);

        this.#value = value;
    }

    get value() { return this.#value; }
}
