
import { Loadable } from 'jitar-serialization';

import ServerError from './generic/ServerError.js';

export default class InvalidClientId extends ServerError
{
    constructor(clientId: string)
    {
        super(`Invalid client id '${clientId}'`);
    }
}

(InvalidClientId as Loadable).source = '/jitar/errors/InvalidClientId.js';
