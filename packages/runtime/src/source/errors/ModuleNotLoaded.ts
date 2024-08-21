
import { Loadable } from '@jitar/serialization';

import LoadingError from './LoadingError';

export default class ModuleNotLoaded extends LoadingError
{
    #url: string;
    #reason?: string;

    constructor(url: string, reason?: string)
    {
        const postfix = reason !== undefined ? ` | ${reason}` : '';

        super(`Module '${url}' could not be loaded${postfix}`);

        this.#url = url;
        this.#reason = reason;
    }

    get url() { return this.#url; }

    get reason() { return this.#reason; }
}

(ModuleNotLoaded as Loadable).source = 'RUNTIME_ERROR_LOCATION';
