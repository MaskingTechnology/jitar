
import ReflectionModel from './ReflectionModel.js';

export default class ReflectionImport extends ReflectionModel
{
    #name: string;
    #as: string;
    #from: string;

    constructor(name: string, as: string, from: string)
    {
        super();
        
        this.#name = name;
        this.#as = as;
        this.#from = from;
    }

    get name(): string { return this.#name; }

    get as(): string { return this.#as; }

    get from(): string { return this.#from; }
}
