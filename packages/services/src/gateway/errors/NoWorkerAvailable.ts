
import { ServerError } from '@jitar/errors';

export default class NoWorkerAvailable extends ServerError
{
    readonly #name: string;

    constructor(name: string)
    {
        super(`No worker available for procedure '${name}'`);

        this.#name = name;
    }

    get name() { return this.#name; }
}
