
import { Loadable } from '@jitar/serialization';

import Forbidden from './generic/Forbidden.js';

export default class ModuleNotAccessible extends Forbidden
{
    #url: string;

    constructor(url: string)
    {
        super(`Module '${url}' is not accessible`);

        this.#url = url;
    }

    get url() { return this.#url; }
}

(ModuleNotAccessible as Loadable).source = 'RUNTIME_ERROR_LOCATION';
