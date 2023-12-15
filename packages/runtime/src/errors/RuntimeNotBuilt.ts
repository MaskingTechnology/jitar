
import { Loadable } from '@jitar/serialization';

import ServerError from './generic/ServerError.js';

export default class RuntimeNotBuilt extends ServerError
{
    constructor(reason: string)
    {
        super(`Building the runtime failed: ${reason}`);
    }
}

(RuntimeNotBuilt as Loadable).source = 'RUNTIME_ERROR_LOCATION';
