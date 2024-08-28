
import { Loadable } from '@jitar/serialization';

import ExecutionError from './ExecutionError';

export default class InvalidVersionNumber extends ExecutionError
{
    #number: string;

    constructor(number: string)
    {
        super(`Invalid version number '${number}'`);

        this.#number = number;
    }

    get number() { return this.#number; }
}

(InvalidVersionNumber as Loadable).source = 'RUNTIME_ERROR_LOCATION';
