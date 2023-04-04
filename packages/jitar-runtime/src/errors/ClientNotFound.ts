
import { Loadable } from 'jitar-serialization';

export default class ClientNotFound extends Error
{
    #clientId: string;

    constructor(clientId: string)
    {
        super(`Client found for id '${clientId}'`);

        this.#clientId = clientId;
    }

    get clientId() { return this.#clientId; }
}

(ClientNotFound as Loadable).source = '/jitar/errors/ClientNotFound.js';
