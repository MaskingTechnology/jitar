
import { Loadable } from 'jitar-serialization';

import BadRequest from './generic/BadRequest.js';

export default class MissingParameterValue extends BadRequest
{
    constructor(parameterName: string)
    {
        super(`Missing value for parameter '${parameterName}'`);
    }
}

(MissingParameterValue as Loadable).source = '/jitar/errors/MissingParameterValue.js';
