
import { Loadable } from '@jitar/serialization';

import BadRequest from './generic/BadRequest.js';

export default class ClientNotFound extends BadRequest
{
    #clientId: string;

    constructor(clientId: string)
    {
        super(`Client not found for id '${clientId}'`);

        this.#clientId = clientId;
    }

    get clientId() { return this.#clientId; }
}

(ClientNotFound as Loadable).source = '/jitar-runtime/errors/ClientNotFound.js';
