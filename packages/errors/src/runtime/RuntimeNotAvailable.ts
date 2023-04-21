
import { Loadable } from '@jitar/serialization';

import createSource from '../sourcing.js';

import ServerError from '../generic/ServerError.js';

export default class RuntimeNotAvailable extends ServerError
{
    constructor()
    {
        super(`Runtime not available`);
    }
}

(RuntimeNotAvailable as Loadable).source = createSource(import.meta.url);
