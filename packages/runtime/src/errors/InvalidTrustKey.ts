
import { Loadable } from '@jitar/serialization';

import Unauthorized from './generic/Unauthorized.js';

export default class InvalidTrustKey extends Unauthorized
{
    constructor()
    {
        super(`Invalid trust key`);
    }
}

(InvalidTrustKey as Loadable).source = 'RUNTIME_ERROR_LOCATION';
