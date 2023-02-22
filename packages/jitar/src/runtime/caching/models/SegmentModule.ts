
import Implementation from './Implementation.js';

import { ReflectionModule } from 'jitar-reflection';

export default class SegmentModule
{
    #filename: string;
    #exports: ReflectionModule;
    #implementations: Map<string, Implementation>;

    constructor(filename: string, exports: ReflectionModule, implementations: Map<string, Implementation>)
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
