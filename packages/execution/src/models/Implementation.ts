
import { AccessLevels, AccessLevel } from '../definitions/AccessLevel';

import type Parameter from './Parameter';
import type Version from './Version';

export default class Implementation
{
    readonly #version: Version;
    readonly #access: AccessLevel;
    readonly #parameters: Parameter[];
    readonly #executable: Function;

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

    get private() { return this.#access === AccessLevels.PRIVATE; }

    get parameters() { return this.#parameters; }

    get executable() { return this.#executable; }
}
