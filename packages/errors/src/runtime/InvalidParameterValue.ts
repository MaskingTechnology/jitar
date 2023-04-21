
import { Loadable } from '@jitar/serialization';

import createSource from '../sourcing.js';

import BadRequest from '../generic/BadRequest.js';

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

(InvalidParameterValue as Loadable).source = createSource(import.meta.url);
