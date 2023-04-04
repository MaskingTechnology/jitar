
import { Loadable } from 'jitar-serialization';

import ServerError from './generic/ServerError.js';

export default class InvalidClientId extends ServerError
{
    #clientId: string;

    constructor(clientId: string)
    {
        super(`Invalid client id '${clientId}'`);

        this.#clientId = clientId;
    }

    get clientId() { return this.#clientId; }
}

(InvalidClientId as Loadable).source = '/jitar/errors/InvalidClientId.js';
