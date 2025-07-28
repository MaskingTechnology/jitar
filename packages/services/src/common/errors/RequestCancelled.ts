
import { ServerError } from '@jitar/errors';

export default class RequestCancelled extends ServerError
{
    constructor()
    {
        super('Request cancelled');
    }
}
