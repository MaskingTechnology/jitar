
import type { ESModule } from '@jitar/analysis';

export default class Module
{
    readonly #filename: string;
    readonly #model: ESModule;

    constructor(filename: string, model: ESModule)
    {
        this.#filename = filename;
        this.#model = model;
    }

    get filename() { return this.#filename; }

    get model() { return this.#model; }
}
