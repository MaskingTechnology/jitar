
import Component from '../types/Component.js';

export default class NotFound extends Error
{
    constructor(message = 'Not found')
    {
        super(message);
    }
}

(NotFound as Component).source = '/jitar/core/errors/NotFound.js';
