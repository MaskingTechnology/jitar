
import { Loadable } from 'jitar-serialization';

export default class Forbidden extends Error
{
    constructor(message = 'Forbidden')
    {
        super(message);
    }
}

(Forbidden as Loadable).source = '/jitar/errors/generic/Forbidden.js';
