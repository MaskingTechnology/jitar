
import type { ReflectionFunction } from '@jitar/reflection';

export default class Implementation
{
    #id: string;
    #importKey: string;
    #fqn: string;
    #access: string;
    #version: string;
    #importDefault: boolean;
    #executable: ReflectionFunction;

    constructor(id: string, importKey: string, fqn: string, access: string, version: string, importDefault: boolean, executable: ReflectionFunction)
    {
        this.#id = id;
        this.#importKey = importKey;
        this.#fqn = fqn;
        this.#access = access;
        this.#version = version;
        this.#importDefault = importDefault;
        this.#executable = executable;
    }

    get id() { return this.#id; }

    get importKey() { return this.#importKey; }

    get fqn() { return this.#fqn; }

    get access() { return this.#access; }

    get version() { return this.#version; }

    get importDefault() { return this.#importDefault; }

    get executable() { return this.#executable; }
}
