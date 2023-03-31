
import { Loadable } from 'jitar-serialization';

export default class ClientNotFound extends Error
{
    constructor(clientId: string)
    {
        super(`Client found for id '${clientId}'`);
    }
}

(ClientNotFound as Loadable).source = '/jitar/errors/ClientNotFound.js';
