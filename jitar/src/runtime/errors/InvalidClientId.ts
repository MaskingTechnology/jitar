
import Component from '../../core/types/Component.js';

export default class InvalidClientId extends Error
{
    constructor(clientId: string)
    {
        super(`Invalid client id '${clientId}'`);
    }
}

(InvalidClientId as Component).source = '/jitar/runtime/errors/InvalidClientId.js';
