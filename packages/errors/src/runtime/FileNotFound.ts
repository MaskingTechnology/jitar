
import { Loadable } from '@jitar/serialization';

import createSource from '../sourcing.js';

import NotFound from '../generic/NotFound.js';

export default class FileNotFound extends NotFound
{
    #filename: string;

    constructor(filename: string)
    {
        super(`The file '${filename} could not be found'`);

        this.#filename = filename;
    }

    get filename() { return this.#filename; }
}

(FileNotFound as Loadable).source = createSource(import.meta.url);
