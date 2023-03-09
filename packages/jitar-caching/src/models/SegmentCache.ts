
import SegmentImport from './SegmentImport.js';
import SegmentProcedure from './SegmentProcedure.js';

export default class SegmentCache
{
    #name: string;
    #imports: SegmentImport[];
    #procedures: SegmentProcedure[];
    #files: string[];

    constructor(name: string, files: string[], imports: SegmentImport[], procedures: SegmentProcedure[])
    {
        this.#name = name;
        this.#files = files;
        this.#imports = imports;
        this.#procedures = procedures;
    }

    get name() { return this.#name; }

    get files() { return this.#files; }

    get imports() { return this.#imports; }

    get procedures() { return this.#procedures; }
}
