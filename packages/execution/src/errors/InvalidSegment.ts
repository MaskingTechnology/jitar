
import { ServerError } from '@jitar/errors';

export default class InvalidSegment extends ServerError
{
    constructor()
    {
        super('Invalid segment');
    }
}
