
import type { ESModule } from '@jitar/analysis';

export default class Module
{
    readonly #filename: string;
    readonly #code: string;
    readonly #model: ESModule;

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
