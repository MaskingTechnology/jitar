
import Component from '../types/Component.js';

export default class NotImplemented extends Error
{
    constructor()
    {
        super('Not implemented');
    }
}

(NotImplemented as Component).source = '/jitar/core/errors/NotImplemented.js';
