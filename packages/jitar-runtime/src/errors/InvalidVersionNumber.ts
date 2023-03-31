
import { Loadable } from 'jitar-serialization';

import BadRequest from './generic/BadRequest.js';

export default class InvalidVersionNumber extends BadRequest
{
    constructor(number: string)
    {
        super(`Invalid version number '${number}'`);
    }
}

(InvalidVersionNumber as Loadable).source = '/jitar/errors/InvalidVersionNumber.js';
