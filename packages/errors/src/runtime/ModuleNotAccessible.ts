
import { Loadable } from '@jitar/serialization';

import createSource from '../sourcing.js';

import Forbidden from '../generic/Forbidden.js';

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

(ModuleNotAccessible as Loadable).source = createSource(import.meta.url);
