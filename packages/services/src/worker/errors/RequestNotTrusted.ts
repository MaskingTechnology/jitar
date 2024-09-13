
import { Unauthorized } from '@jitar/errors';

export default class RequestNotTrusted extends Unauthorized
{
    constructor()
    {
        super(`Request not trusted`);
    }
}
