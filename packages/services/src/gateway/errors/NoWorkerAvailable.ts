
import { ServerError } from '@jitar/errors';
import { Loadable } from '@jitar/serialization';

export default class NoWorkerAvailable extends ServerError
{
    #name: string;

    constructor(name: string)
    {
        super(`No worker available for procedure '${name}'`);

        this.#name = name;
    }

    get name() { return this.#name; }
}

(NoWorkerAvailable as Loadable).source = 'RUNTIME_ERROR_LOCATION';
