
import type Segment from './Segment';

export default class Segmentation
{
    readonly #segments: Segment[];

    constructor(segments: Segment[])
    {
        this.#segments = segments;
    }

    get segments() { return this.#segments; }

    getSegment(segmentName: string): Segment | undefined
    {
        return this.#segments.find(segment => segment.name === segmentName);
    }

    isSegmentedModule(moduleFilename: string): boolean
    {
        return this.#segments.some(segment => segment.hasModule(moduleFilename));
    }

    getSegments(moduleFilename: string): Segment[]
    {
        return this.#segments.filter(segment => segment.hasModule(moduleFilename));
    }
}
