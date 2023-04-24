
import { Loadable } from '@jitar/serialization';

import ServerError from './generic/ServerError.js';

export default class RepositoryNotAvailable extends ServerError
{
    constructor()
    {
        super(`Repository not available`);
    }
}

(RepositoryNotAvailable as Loadable).source = 'RUNTIME_ERROR_LOCATION';
