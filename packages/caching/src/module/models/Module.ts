
import type { ReflectionModule } from '@jitar/reflection';

export default class Module
{
    #filename: string;
    #code: string;
    #reflection: ReflectionModule;

    constructor(filename: string, code: string, reflection: ReflectionModule)
    {
        this.#code = code;
        this.#filename = filename;
        this.#reflection = reflection;
    }

    get filename() { return this.#filename; }

    get code() { return this.#code; }

    get reflection() { return this.#reflection; }
}
