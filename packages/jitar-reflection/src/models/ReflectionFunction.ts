
import ReflectionMember from './ReflectionMember.js';
import ReflectionParameter from './ReflectionParameter.js';

export default class ReflectionFunction extends ReflectionMember
{
    #parameters: ReflectionParameter[];
    #body: string;
    #isAsync: boolean;

    constructor(name: string, parameters: ReflectionParameter[], body: string, isStatic = false, isAsync = false, isPrivate = false)
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
