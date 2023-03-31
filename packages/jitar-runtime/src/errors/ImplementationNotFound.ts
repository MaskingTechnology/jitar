
import { Loadable } from 'jitar-serialization';

import NotFound from './generic/NotFound.js';

export default class ImplementationNotFound extends NotFound
{
    constructor(fqn: string, version: string)
    {
        super(`No implementation found for procedure '${fqn}' with version '${version}'`);
    }
}

(ImplementationNotFound as Loadable).source = '/jitar/errors/ImplementationNotFound.js';
