
import Module from './Module.js';
import SegmentModule from './SegmentModule.js';

export default class ModuleCache
{
    #module: Module;
    #segment?: SegmentModule;

    constructor(module: Module, segment?: SegmentModule)
    {
        this.#module = module;
        this.#segment = segment;
    }

    get module() { return this.#module; }

    get segment() { return this.#segment; }
}
