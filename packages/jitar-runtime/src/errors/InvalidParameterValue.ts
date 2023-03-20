
import { Loadable } from 'jitar-serialization';

import BadRequest from './generic/BadRequest.js';

export default class InvalidParameterValue extends BadRequest
{
    constructor(parameterName: string)
    {
        super(`Invalid value for parameter '${parameterName}'`);
    }
}

(InvalidParameterValue as Loadable).source = '/jitar/errors/InvalidParameterValue.js';
