
import { Unauthorized } from '@jitar/errors';
import { Loadable } from '@jitar/serialization';

export default class InvalidTrustKey extends Unauthorized
{
    constructor()
    {
        super(`Invalid trust key`);
    }
}

(InvalidTrustKey as Loadable).source = 'RUNTIME_ERROR_LOCATION';
