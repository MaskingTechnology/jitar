
import { Loadable } from 'jitar-serialization';

import BadRequest from './generic/BadRequest.js';

export default class MissingParameterValue extends BadRequest
{
    #parameterName: string;

    constructor(parameterName: string)
    {
        super(`Missing value for parameter '${parameterName}'`);

        this.#parameterName = parameterName;
    }

    get parameterName() { return this.#parameterName; }
}

(MissingParameterValue as Loadable).source = '/jitar/errors/MissingParameterValue.js';
