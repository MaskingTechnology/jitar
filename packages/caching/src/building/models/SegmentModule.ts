
import SegmentProcedure from './SegmentProcedure.js';

export default class SegmentModule
{
    #filename: string;
    #procedures: SegmentProcedure[] = [];

    constructor(filename: string, procedures: SegmentProcedure[])
    {
        this.#filename = filename;
        this.#procedures = procedures;
    }

    get filename() { return this.#filename; }

    get procedures() { return this.#procedures; }
}
