
export default class ApplicationModule
{
    #filename: string;
    #classes: Map<string, Function>;
    #functions: Map<string, Function>;

    constructor(filename: string, classes: Map<string, Function>, functions: Map<string, Function>)
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
