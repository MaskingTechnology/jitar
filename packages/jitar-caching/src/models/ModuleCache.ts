
import { ReflectionClass, ReflectionFunction, ReflectionImport } from 'jitar-reflection';

export default class ModuleCache
{
    #filename: string;
    #code: string;
    #classes: ReflectionClass[];
    #functions: ReflectionFunction[];

    constructor(filename: string, code: string, classes: ReflectionClass[], functions: ReflectionFunction[])
    {
        this.#filename = filename;
        this.#code = code;
        this.#classes = classes;
        this.#functions = functions;
    }

    get filename() { return this.#filename; }

    get code() { return this.#code; }

    get classes() { return this.#classes; }

    get functions() { return this.#functions; }
}
