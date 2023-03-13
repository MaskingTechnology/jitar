
import Module from './Module.js';
import Segment from './Segment.js';
import SegmentModule from './SegmentModule.js';

export default class Application
{
    #segments: Segment[];
    #modules: Module[];

    constructor(segments: Segment[], modules: Module[])
    {
        this.#segments = segments;
        this.#modules = modules;
    }

    get segments() { return this.#segments; }

    get modules() { return this.#modules; }

    getSegmentModule(filename: string): SegmentModule | undefined
    {
        const segment = this.#segments.find((segment) => segment.hasModule(filename));

        if (segment === undefined)
        {
            return undefined;
        }

        return segment.getModule(filename);
    }
}
