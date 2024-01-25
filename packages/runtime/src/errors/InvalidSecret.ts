
import { Loadable } from '@jitar/serialization';

import Unauthorized from './generic/Unauthorized.js';

export default class InvalidSecret extends Unauthorized
{
    constructor()
    {
        super(`Invalid secret`);
    }
}

(InvalidSecret as Loadable).source = 'RUNTIME_ERROR_LOCATION';
