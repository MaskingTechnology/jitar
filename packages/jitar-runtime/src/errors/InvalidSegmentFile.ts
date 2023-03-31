
import { Loadable } from 'jitar-serialization';

import ServerError from './generic/ServerError.js';

export default class InvalidSegmentFile extends ServerError
{
    constructor(filename: string)
    {
        super(`Missing files array in segment file '${filename}'`);
    }
}

(InvalidSegmentFile as Loadable).source = '/jitar/errors/InvalidSegmentFile.js';
