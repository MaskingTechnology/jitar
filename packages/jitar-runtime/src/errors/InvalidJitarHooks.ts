
import { Loadable } from 'jitar-serialization';

import ServerError from './generic/ServerError.js';

export default class InvalidJitarHooks extends ServerError
{
    constructor()
    {
        super(`Invalid Jitar hooks`);
    }
}

(InvalidJitarHooks as Loadable).source = '/jitar/errors/InvalidJitarHooks.js';
