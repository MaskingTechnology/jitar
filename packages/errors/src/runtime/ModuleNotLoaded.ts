
import { Loadable } from '@jitar/serialization';

import createSource from '../sourcing.js';

import ServerError from '../generic/ServerError.js';

export default class ModuleNotLoaded extends ServerError
{
    #url: string;
    #reason?: string;

    constructor(url: string, reason?: string)
    {
        super(`Module '${url}' could not be loaded${reason !== undefined ? ` | ${reason}` : ''}`);

        this.#url = url;
        this.#reason = reason;
    }

    get url() { return this.#url; }

    get reason() { return this.#reason; }
}

(ModuleNotLoaded as Loadable).source = createSource(import.meta.url);
