
import { AccessLevels, AccessLevel } from '../definitions/AccessLevel';

import Parameter from './Parameter';
import Version from './Version';

export default class Implementation
{
    #version: Version;
    #access: AccessLevel;
    #parameters: Parameter[];
    #executable: Function;

    constructor(version: Version, access: AccessLevel, parameters: Parameter[], executable: Function)
    {
        this.#version = version;
        this.#access = access;
        this.#parameters = parameters;
        this.#executable = executable;
    }

    get version() { return this.#version; }

    get public() { return this.#access === AccessLevels.PUBLIC; }

    get protected() { return this.#access === AccessLevels.PROTECTED; }

    get parameters() { return this.#parameters; }

    get executable() { return this.#executable; }
}
