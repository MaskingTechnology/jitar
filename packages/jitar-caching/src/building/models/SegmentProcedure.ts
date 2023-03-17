
import SegmentImplementation from './SegmentImplementation.js';

export default class SegmentProcedure
{
    #fqn: string;
    #implementations: SegmentImplementation[] = [];

    constructor(fqn: string, implementations: SegmentImplementation[] = [])
    {
        this.#fqn = fqn;
        this.#implementations = implementations;
    }

    get fqn() { return this.#fqn; }

    get implementations() { return this.#implementations; }

    addImplementation(implementation: SegmentImplementation): void
    {
        this.#implementations.push(implementation);
    }
}
