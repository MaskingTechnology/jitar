
import ReflectionMember from './ReflectionMember.js';

export default class ReflectionField extends ReflectionMember
{
    #value: unknown | undefined;
    #isStatic: boolean;
    #isReadable: boolean;
    #isWritable: boolean;

    constructor(name: string, value: unknown | undefined, isStatic: boolean = false, isReadable: boolean = true, isWritable: boolean = true)
    {
        super(name);

        this.#value = value;
        this.#isStatic = isStatic;
        this.#isReadable = isReadable;
        this.#isWritable = isWritable;
    }

    get value(): unknown | undefined { return this.#value; }

    get isStatic(): boolean { return this.#isStatic; }

    get isReadable(): boolean { return this.isPublic || this.#isReadable; }

    get isWritable(): boolean { return this.isPublic || this.#isWritable; }
}
