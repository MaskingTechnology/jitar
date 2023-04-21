
import { Loadable } from '@jitar/serialization';

import createSource from '../sourcing.js';

import BadRequest from '../generic/BadRequest.js';

export default class InvalidClientId extends BadRequest
{
    #clientId: string;

    constructor(clientId: string)
    {
        super(`Invalid client id '${clientId}'`);

        this.#clientId = clientId;
    }

    get clientId() { return this.#clientId; }
}

(InvalidClientId as Loadable).source = createSource(import.meta.url);
