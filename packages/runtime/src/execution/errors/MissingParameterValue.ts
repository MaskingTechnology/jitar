
import { Loadable } from '@jitar/serialization';

import ExecutionError from './ExecutionError';

export default class MissingParameterValue extends ExecutionError
{
    #parameterName: string;

    constructor(parameterName: string)
    {
        super(`Missing value for parameter '${parameterName}'`);

        this.#parameterName = parameterName;
    }

    get parameterName() { return this.#parameterName; }
}

(MissingParameterValue as Loadable).source = 'RUNTIME_ERROR_LOCATION';
