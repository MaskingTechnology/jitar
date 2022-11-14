
import Component from '../../core/types/Component.js';

export default class SegmentNotFound extends Error
{
    constructor(source: string)
    {
        super(`Segment found for '${source}'`);
    }
}

(SegmentNotFound as Component).source = '/jitar/runtime/errors/SegmentNotFound.js';
