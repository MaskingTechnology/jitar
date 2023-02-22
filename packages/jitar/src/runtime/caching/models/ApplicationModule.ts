
import { ReflectionClass, ReflectionFunction } from 'jitar-reflection';

export default class ApplicationModule
{
    #filename: string;
    #classes: Map<string, ReflectionClass>;
    #functions: Map<string, ReflectionFunction>;

    constructor(filename: string, classes: Map<string, ReflectionClass>, functions: Map<string, ReflectionFunction>)
    {
        this.#filename = filename;
        this.#classes = classes;
        this.#functions = functions;
    }

    get filename() { return this.#filename; }

    get classes() { return this.#classes; }

    get functions() { return this.#functions; }

    hasClasses()
    {
        return this.#classes.size > 0;
    }

    hasFunctions()
    {
        return this.#functions.size > 0;
    }
}
