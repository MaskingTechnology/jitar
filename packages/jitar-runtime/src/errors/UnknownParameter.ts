
import { Loadable } from 'jitar-serialization';

import BadRequest from './generic/BadRequest.js';

export default class UnknownParameter extends BadRequest
{
    constructor(parameterName: string)
    {
        super(`Unknown parameter ${parameterName}`)
    }
}

(UnknownParameter as Loadable).source = '/jitar/errors/UnknownParameter.js'
