
import { Loadable } from '@jitar/serialization';

import LoadingError from './LoadingError';

export default class FileNotFound extends LoadingError
{
    #filename: string;

    constructor(filename: string)
    {
        super(`The file '${filename}' could not be found`);

        this.#filename = filename;
    }

    get filename() { return this.#filename; }
}

(FileNotFound as Loadable).source = 'RUNTIME_ERROR_LOCATION';
