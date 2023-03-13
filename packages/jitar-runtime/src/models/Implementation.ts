
import Parameter from '../interfaces/Parameter.js';
import { AccessLevel } from '../definitions/AccessLevel.js';
import Version from './Version.js';

export default class Implementation
{
    #version: Version;
    #access: string;
    #parameters: Parameter[];
    #executable: Function;

    constructor(version: Version, access: string, parameters: Parameter[], executable: Function)
    {
        this.#version = version;
        this.#access = access;
        this.#parameters = parameters;
        this.#executable = executable;
    }

    get version() { return this.#version; }

    get public() { return this.#access === AccessLevel.PUBLIC; }

    get parameters() { return this.#parameters; }

    get executable() { return this.#executable; }
}
