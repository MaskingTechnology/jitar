
import { Loadable } from '@jitar/serialization';

import ServerError from './generic/ServerError.js';

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

(SegmentNotFound as Loadable).source = 'RUNTIME_ERROR_LOCATION';
