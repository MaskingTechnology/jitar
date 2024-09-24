
import type { ESFunction } from '@jitar/analysis';

import Member from './Member';

export default class Implementation extends Member
{
    #access: string;
    #version: string;
    #model: ESFunction;

    constructor(id: string, importKey: string, fqn: string, access: string, version: string, model: ESFunction)
    {
        super(id, importKey, fqn);

        this.#access = access;
        this.#version = version;
        this.#model = model;
    }

    get access() { return this.#access; }

    get version() { return this.#version; }

    get model() { return this.#model; }
}
