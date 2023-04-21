
import { Loadable } from '@jitar/serialization';

import createSource from '../sourcing.js';

import ServerError from '../generic/ServerError.js';

export default class SegmentNotFound extends ServerError
{
    #source: string;

    constructor(source: string)
    {
        super(`Segment found for '${source}'`);

        this.#source = source;
    }

    get source() { return this.#source; }
}

(SegmentNotFound as Loadable).source = createSource(import.meta.url);
