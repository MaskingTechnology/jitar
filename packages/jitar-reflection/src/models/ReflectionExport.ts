
import ReflectionModel from './ReflectionModel.js';

export default class ReflectionExport extends ReflectionModel
{
    #name: string;
    #as: string;

    constructor(name: string, as: string)
    {
        super();
        
        this.#name = name;
        this.#as = as;
    }

    get name(): string { return this.#name; }

    get as(): string { return this.#as; }
}
