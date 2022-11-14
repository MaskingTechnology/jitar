
import Component from '../../core/types/Component.js';

export default class ClientNotFound extends Error
{
    constructor(clientId: string)
    {
        super(`Client found for id '${clientId}'`);
    }
}

(ClientNotFound as Component).source = '/jitar/runtime/errors/ClientNotFound.js';
