
import { Loadable } from 'jitar-serialization';

import ServerError from './generic/ServerError.js';

export default class RuntimeNotAvailable extends ServerError
{
    constructor()
    {
        super(`Runtime not available`);
    }
}

(RuntimeNotAvailable as Loadable).source = '/jitar/errors/RuntimeNotAvailable.js';
