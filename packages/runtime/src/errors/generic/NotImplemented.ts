
import { Loadable } from '@jitar/serialization';

export default class NotImplemented extends Error
{
    constructor(message = 'Not implemented')
    {
        super(message);
    }
}

(NotImplemented as Loadable).source = '/jitar-runtime/errors/generic/NotImplemented.js';
