
import { Loadable } from 'jitar-serialization';

import ServerError from './generic/ServerError.js';

export default class SegmentNotFound extends ServerError
{
    constructor(source: string)
    {
        super(`Segment found for '${source}'`);
    }
}

(SegmentNotFound as Loadable).source = '/jitar/errors/SegmentNotFound.js';
