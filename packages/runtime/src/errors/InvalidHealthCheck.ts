
import { Loadable } from '@jitar/serialization';

import ServerError from './generic/ServerError.js';

export default class InvalidHealthCheck extends ServerError
{
    #url: string;

    constructor(url: string)
    {
        super(`Module '${url}' does not export a valid health check`);

        this.#url = url;
    }

    get url() { return this.#url; }
}

(InvalidHealthCheck as Loadable).source = 'RUNTIME_ERROR_LOCATION';
