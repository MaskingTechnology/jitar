
import Component from '../../../core/types/Component.js';
import FqnBuilder from '../../../core/utils/FqnBuilder.js';

let lastId = 0;

export default class Implementation
{
    #id: number;
    #module: string;
    #name: string;
    #fqn: string;
    #access: string;
    #version: string;
    #executable: Component;

    constructor(module: string, name: string, access: string, version: string, executable: Component)
    {
        this.#id = ++lastId;
        this.#module = module;
        this.#name = name;
        this.#fqn = FqnBuilder.build(module, name);
        this.#access = access;
        this.#version = version;
        this.#executable = executable;
    }

    get id() { return this.#id; }

    get module() { return this.#module; }

    get name() { return this.#name; }

    get fqn() { return this.#fqn; }

    get access() { return this.#access; }

    get version() { return this.#version; }

    get executable() { return this.#executable; }
}
