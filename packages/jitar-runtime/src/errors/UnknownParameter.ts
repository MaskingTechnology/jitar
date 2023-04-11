
import { Loadable } from 'jitar-serialization';

import BadRequest from './generic/BadRequest.js';

export default class UnknownParameter extends BadRequest
{
    #parameterName: string;

    constructor(parameterName: string)
    {
        super(`Unknown parameter ${parameterName}`);

        this.#parameterName = parameterName;
    }

    get parameterName() { return this.#parameterName; }
}

(UnknownParameter as Loadable).source = '/jitar-runtime/errors/UnknownParameter.js';
