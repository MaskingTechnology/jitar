
import { Loadable } from '@jitar/serialization';

import createSource from '../sourcing.js';

import ServerError from '../generic/ServerError.js';

export default class RepositoryNotAvailable extends ServerError
{
    constructor()
    {
        super(`Repository not available`);
    }
}

(RepositoryNotAvailable as Loadable).source = createSource(import.meta.url);
