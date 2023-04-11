
import { Loadable } from 'jitar-serialization';

import BadRequest from './generic/BadRequest.js';

export default class InvalidParameterValue extends BadRequest
{
    #parameterName: string;

    constructor(parameterName: string)
    {
        super(`Invalid value for parameter '${parameterName}'`);

        this.#parameterName = parameterName;
    }

    get parameterName() { return this.#parameterName; }
}

(InvalidParameterValue as Loadable).source = '/jitar-runtime/errors/InvalidParameterValue.js';
