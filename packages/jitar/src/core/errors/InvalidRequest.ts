
import Component from '../types/Component.js';

export default class InvalidRequest extends Error
{
    constructor(message = 'Invalid request')
    {
        super(message);
    }
}

(InvalidRequest as Component).source = '/jitar/core/errors/InvalidRequest.js';
