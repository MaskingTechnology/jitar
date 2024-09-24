
import type { ESModule } from '@jitar/analysis';

export default class Module
{
    #filename: string;
    #code: string;
    #model: ESModule;

    constructor(filename: string, code: string, model: ESModule)
    {
        this.#code = code;
        this.#filename = filename;
        this.#model = model;
    }

    get filename() { return this.#filename; }

    get code() { return this.#code; }

    get model() { return this.#model; }
}
