
import { ReflectionFunction } from '@jitar/reflection';

export default class SegmentImplementation
{
    #id: string;
    #importKey: string;
    #access: string;
    #version: string;
    #executable: ReflectionFunction;

    constructor(id: string, importKey: string, access: string, version: string, executable: ReflectionFunction)
    {
        this.#id = id;
        this.#importKey = importKey;
        this.#access = access;
        this.#version = version;
        this.#executable = executable;
    }

    get id() { return this.#id; }

    get importKey() { return this.#importKey; }

    get access() { return this.#access; }

    get version() { return this.#version; }

    get executable() { return this.#executable; }
}
