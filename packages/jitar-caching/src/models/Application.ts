
import Module from './Module.js';
import Segment from './Segment.js';

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
}
