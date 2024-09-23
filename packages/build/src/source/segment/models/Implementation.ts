
import type { ReflectionFunction } from '@jitar/reflection';

import Member from './Member';

export default class Implementation extends Member
{
    #access: string;
    #version: string;
    #reflection: ReflectionFunction;

    constructor(id: string, importKey: string, fqn: string, access: string, version: string, reflection: ReflectionFunction)
    {
        super(id, importKey, fqn);

        this.#access = access;
        this.#version = version;
        this.#reflection = reflection;
    }

    get access() { return this.#access; }

    get version() { return this.#version; }

    get reflection() { return this.#reflection; }
}
