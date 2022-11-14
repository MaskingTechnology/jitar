
import Procedure from './Procedure.js';
import SegmentModule from './SegmentModule.js';

export default class Segment
{
    #filename: string;
    #modules: SegmentModule[];
    #procedures: Map<string, Procedure>;

    constructor(filename: string, modules: SegmentModule[], procedures: Map<string, Procedure>)
    {
        this.#filename = filename;
        this.#modules = modules;
        this.#procedures = procedures;
    }

    get filename() { return this.#filename; }

    get modules() { return this.#modules; }

    get procedures() { return this.#procedures; }

    getFilenames()
    {
        return this.#modules.map((module: SegmentModule) => module.filename);
    }
}
