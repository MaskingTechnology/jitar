
import ReflectionModel from './ReflectionModel.js';

export default class ReflectionMember extends ReflectionModel
{
    #name: string;
    #isStatic: boolean;
    #isPrivate: boolean;

    constructor(name: string, isStatic = false, isPrivate = false)
    {
        super();
        
        this.#name = name;
        this.#isStatic = isStatic;
        this.#isPrivate = isPrivate;
    }

    get name() { return this.#name; }

    get isStatic() { return this.#isStatic; }

    get isPrivate() { return this.#isPrivate; }
}
