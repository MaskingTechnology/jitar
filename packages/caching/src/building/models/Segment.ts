
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

    hasModule(filename: string): boolean
    {
        return this.#modules.some((module) => module.filename === filename);
    }

    getModule(filename: string): SegmentModule | undefined
    {
        return this.#modules.find((module) => module.filename === filename);
    }
}
