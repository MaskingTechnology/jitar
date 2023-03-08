
import SegmentModule from './SegmentModule.js';

export default class Segment
{
    #name: string;
    #modules: SegmentModule[];

    constructor(name: string, modules: SegmentModule[])
    {
        this.#name = name;
        this.#modules = modules;
    }

    get name() { return this.#name; }

    get modules() { return this.#modules; }
}
