
import Component from '../../core/types/Component.js';

export default class InvalidSegmentFile extends Error
{
    constructor(filename: string)
    {
        super(`Missing files array in segment file '${filename}'`);
    }
}

(InvalidSegmentFile as Component).source = '/jitar/runtime/errors/InvalidSegmentFile.js';
