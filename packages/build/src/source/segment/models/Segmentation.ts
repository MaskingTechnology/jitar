
import type Segment from './Segment';

export default class Segmentation
{
    #segments: Segment[];

    constructor(segments: Segment[])
    {
        this.#segments = segments;
    }

    get segments() { return this.#segments; }

    getSegment(segmentName: string): Segment | undefined
    {
        return this.#segments.find(segment => segment.name === segmentName);
    }

    isModuleSegmented(moduleFilename: string): boolean
    {
        return this.#segments.some(segment => segment.hasModule(moduleFilename));
    }

    getSegments(moduleFilename: string): Segment[]
    {
        return this.#segments.filter(segment => segment.hasModule(moduleFilename));
    }
}
