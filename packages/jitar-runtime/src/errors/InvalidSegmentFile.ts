
import { Loadable } from 'jitar-serialization';

import ServerError from './generic/ServerError.js';

export default class InvalidSegmentFile extends ServerError
{
    #filename: string;

    constructor(filename: string)
    {
        super(`Missing files array in segment file '${filename}'`);

        this.#filename = filename;
    }

    get filename() { return this.#filename; }
}

(InvalidSegmentFile as Loadable).source = '/jitar-runtime/errors/InvalidSegmentFile.js';
