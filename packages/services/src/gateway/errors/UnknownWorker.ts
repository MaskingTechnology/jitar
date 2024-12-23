
import { ServerError } from '@jitar/errors';

export default class UnknownWorker extends ServerError
{
    readonly #id: string;

    constructor(id: string)
    {
        super(`Unknown worker id '${id}'`);

        this.#id = id;
    }
    
    get id() { return this.#id; }
}
