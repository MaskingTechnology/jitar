
import { Loadable } from 'jitar-serialization';

import ServerError from './generic/ServerError.js';

export default class ModuleNotLoaded extends ServerError
{
    constructor(url: string, message?: string)
    {
        super(`Module '${url}' could not be loaded${message !== undefined ? ` | ${message}` : ''}`);
    }
}

(ModuleNotLoaded as Loadable).source = '/jitar/errors/ModuleNotLoaded.js';
