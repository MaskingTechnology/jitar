
import { Loadable } from '@jitar/serialization';

import ServerError from './generic/ServerError.js';

export default class InvalidMiddleware extends ServerError
{
    #url: string;

    constructor(url: string)
    {
        super(`Module '${url}' does not export valid middleware`);

        this.#url = url;
    }

    get url() { return this.#url; }
}

(InvalidMiddleware as Loadable).source = 'RUNTIME_ERROR_LOCATION';
