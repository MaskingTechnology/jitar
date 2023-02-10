
import ReflectionModel from './ReflectionModel.js';

export default class ReflectionExport extends ReflectionModel
{
    #name: string;
    #as: string;
    #from?: string;

    constructor(name: string, as: string, from: string | undefined = undefined)
    {
        super();
        
        this.#name = name;
        this.#as = as;
        this.#from = from;
    }

    get name() { return this.#name; }

    get as() { return this.#as; }

    get from() { return this.#from; }
}
