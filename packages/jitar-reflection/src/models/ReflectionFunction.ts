
import ReflectionField from './ReflectionField.js';
import ReflectionMember from './ReflectionMember.js';

export default class ReflectionFunction extends ReflectionMember
{
    #parameters: ReflectionField[];
    #body: string;
    #isAsync: boolean;

    constructor(name: string, parameters: ReflectionField[], body: string, isStatic = false, isAsync = false, isPrivate = false)
    {
        super(name, isStatic, isPrivate);

        this.#parameters = parameters;
        this.#body = body;
        this.#isAsync = isAsync;
    }

    get parameters() { return this.#parameters; }

    get body() { return this.#body; }

    get isAsync() { return this.#isAsync; }
}
