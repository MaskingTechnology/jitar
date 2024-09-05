
import { ReflectionClass } from '@jitar/reflection';

import Member from './Member';

export default class Class extends Member
{
    #reflection: ReflectionClass;

    constructor(id: string, importKey: string, fqn: string, reflection: ReflectionClass)
    {
        super(id, importKey, fqn);

        this.#reflection = reflection;
    }

    get reflection() { return this.#reflection; }
}
