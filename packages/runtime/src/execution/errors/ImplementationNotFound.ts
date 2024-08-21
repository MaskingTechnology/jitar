
import { Loadable } from '@jitar/serialization';

import ExecutionError from './ExecutionError';

export default class ImplementationNotFound extends ExecutionError
{
    #fqn: string;
    #version: string;

    constructor(fqn: string, version: string)
    {
        super(`No implementation found for procedure '${fqn}' with version '${version}'`);

        this.#fqn = fqn;
        this.#version = version;
    }

    get fqn() { return this.#fqn; }

    get version() { return this.#version; }
}

(ImplementationNotFound as Loadable).source = 'RUNTIME_ERROR_LOCATION';
