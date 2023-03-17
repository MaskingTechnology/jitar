
import ModuleCache from './ModuleCache';
import SegmentCache from './SegmentCache.js';

export default class ApplicationCache
{
    #segments: SegmentCache[];
    #modules: ModuleCache[];

    constructor(segments: SegmentCache[], modules: ModuleCache[])
    {
        this.#segments = segments;
        this.#modules = modules;
    }

    get segments() { return this.#segments; }

    get modules() { return this.#modules; }
}
