
import ReflectionMember from './ReflectionMember.js';

export default class ReflectionField extends ReflectionMember
{
    #value: unknown | undefined;

    constructor(name: string, value: unknown | undefined, isStatic = false, isPrivate = false)
    {
        super(name, isStatic, isPrivate);

        this.#value = value;
    }

    get value() { return this.#value; }
}
