
import { Loadable } from '@jitar/serialization';

import ExecutionError from './ExecutionError';

export default class UnknownParameter extends ExecutionError
{
    #parameterName: string;

    constructor(parameterName: string)
    {
        super(`Unknown parameter ${parameterName}`);

        this.#parameterName = parameterName;
    }

    get parameterName() { return this.#parameterName; }
}

(UnknownParameter as Loadable).source = 'RUNTIME_ERROR_LOCATION';
