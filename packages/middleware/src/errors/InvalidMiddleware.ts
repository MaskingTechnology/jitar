
import { ServerError } from '@jitar/errors';

export default class InvalidMiddleware extends ServerError
{
    constructor()
    {
        super('Invalid middleware');
    }
}
