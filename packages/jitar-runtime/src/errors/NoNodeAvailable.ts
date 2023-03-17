
import { Loadable } from 'jitar-serialization';

import ServerError from './generic/ServerError.js';

export default class NoNodeAvailable extends ServerError
{
    constructor(name: string)
    {
        super(`No node available for procedure '${name}'`);
    }
}

(NoNodeAvailable as Loadable).source = '/jitar/errors/NoNodeAvailable.js';
