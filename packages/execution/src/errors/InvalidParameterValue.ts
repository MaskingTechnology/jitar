
import { Loadable } from '@jitar/serialization';

import ExecutionError from './ExecutionError';

export default class InvalidParameterValue extends ExecutionError
{
    #parameterName: string;

    constructor(parameterName: string)
    {
        super(`Invalid value for parameter '${parameterName}'`);

        this.#parameterName = parameterName;
    }

    get parameterName() { return this.#parameterName; }
}

(InvalidParameterValue as Loadable).source = 'RUNTIME_ERROR_LOCATION';
