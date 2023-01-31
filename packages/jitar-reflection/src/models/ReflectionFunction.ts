
import ReflectionField from './ReflectionField.js';
import ReflectionMember from './ReflectionMember.js';

export default class ReflectionFunction extends ReflectionMember
{
    #parameters: ReflectionField[];
    #isAsync: boolean;
    #isStatic: boolean;

    constructor(name: string, parameters: ReflectionField[], isAsync: boolean = false, isStatic: boolean = false)
    {
        super(name);

        this.#parameters = parameters;
        this.#isAsync = isAsync;
        this.#isStatic = isStatic;
    }

    get parameters() { return this.#parameters; }

    get isAsync() { return this.#isAsync; }

    get isStatic() { return this.#isStatic; }
}
