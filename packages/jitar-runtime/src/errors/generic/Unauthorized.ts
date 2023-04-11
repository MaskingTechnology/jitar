
import { Loadable } from '@jitar/serialization';

export default class Unauthorized extends Error
{
    constructor(message = 'Unauthorized')
    {
        super(message);
    }
}

(Unauthorized as Loadable).source = '/jitar-runtime/errors/generic/Unauthorized.js';
