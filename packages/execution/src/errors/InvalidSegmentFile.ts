
import { ServerError } from '@jitar/errors';
import { Loadable } from '@jitar/serialization';

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

(InvalidSegmentFile as Loadable).source = 'RUNTIME_ERROR_LOCATION';
