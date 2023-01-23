
import Component from '../types/Component.js';

export default class NotImplemented extends Error
{
    constructor(message = 'Not implemented')
    {
        super(message);
    }
}

(NotImplemented as Component).source = '/jitar/core/errors/NotImplemented.js';
