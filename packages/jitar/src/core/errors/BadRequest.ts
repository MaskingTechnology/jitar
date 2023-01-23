
import Component from '../types/Component.js';

export default class BadRequest extends Error
{
    constructor(message = 'Invalid request')
    {
        super(message);
    }
}

(BadRequest as Component).source = '/jitar/core/errors/BadRequest.js';
