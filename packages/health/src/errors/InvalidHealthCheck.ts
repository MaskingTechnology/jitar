
import { ServerError } from '@jitar/errors';

export default class InvalidHealthCheck extends ServerError
{
    constructor()
    {
        super('Invalid health check');
    }
}
