
import ReflectionField from './ReflectionField.js';
import ReflectionFunction from './ReflectionFunction.js';
import ReflectionMember from './ReflectionMember.js';

export default class ReflectionClass extends ReflectionMember
{
    #parentName: string | undefined;
    #members: ReflectionMember[];

    constructor(name: string, parentName: string | undefined, members: ReflectionMember[])
    {
        super(name);

        this.#parentName = parentName;
        this.#members = members;
    }

    get parentName(): string | undefined { return this.#parentName; }
    
    get members(): ReflectionMember[] { return this.#members; }

    get fields(): ReflectionMember[] { return this.#members.filter(member => member instanceof ReflectionField); }

    get functions(): ReflectionMember[] { return this.#members.filter(member => member instanceof ReflectionFunction); }
}
