
import Component from '../types/Component.js';

export default class Unauthorized extends Error
{
    constructor(message = 'Unauthorized')
    {
        super(message);
    }
}

(Unauthorized as Component).source = '/jitar/core/errors/Unauthorized.js';
