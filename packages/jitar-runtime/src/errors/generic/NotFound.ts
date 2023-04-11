
import { Loadable } from '@jitar/serialization';

export default class NotFound extends Error
{
    constructor(message = 'Not found')
    {
        super(message);
    }
}

(NotFound as Loadable).source = '/jitar-runtime/errors/generic/NotFound.js';
