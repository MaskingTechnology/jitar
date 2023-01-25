
import Component from '../types/Component.js';

export default class Forbidden extends Error
{
    constructor(message = 'Forbidden')
    {
        super(message);
    }
}

(Forbidden as Component).source = '/jitar/core/errors/Forbidden.js';
