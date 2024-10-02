
import { Unauthorized } from '@jitar/errors';

export default class InvalidTrustKey extends Unauthorized
{
    constructor()
    {
        super(`Invalid trust key`);
    }
}
