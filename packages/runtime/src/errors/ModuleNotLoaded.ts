
import { Loadable } from '@jitar/serialization';

import ServerError from './generic/ServerError.js';

export default class ModuleNotLoaded extends ServerError
{
    #url: string;
    #reason?: string;

    constructor(url: string, reason?: string)
    {
        //eslint-disable-next-line sonarjs/no-nested-template-literals
        super(`Module '${url}' could not be loaded${reason !== undefined ? ` | ${reason}` : ''}`);

        this.#url = url;
        this.#reason = reason;
    }

    get url() { return this.#url; }

    get reason() { return this.#reason; }
}

(ModuleNotLoaded as Loadable).source = 'RUNTIME_ERROR_LOCATION';
