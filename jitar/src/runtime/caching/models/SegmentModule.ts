
import Module from '../../../core/types/Module.js';

import Implementation from './Implementation.js';

export default class SegmentModule
{
    #filename: string;
    #exports: Module;
    #implementations: Map<string, Implementation>;

    constructor(filename: string, exports: Module, implementations: Map<string, Implementation>)
    {
        this.#filename = filename;
        this.#exports = exports;
        this.#implementations = implementations;
    }

    get filename() { return this.#filename; }

    get exports() { return this.#exports; }

    get implementations() { return this.#implementations; }

    getImportKeys() { return [...this.#implementations.keys()]; }
}
