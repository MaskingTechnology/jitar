
import { ServerError } from '@jitar/errors';

export default class UnknownWorker extends ServerError
{
    #url: string;

    constructor(url: string)
    {
        super(`Unknown worker for '${url}'`);

        this.#url = url;
    }

    get url() { return this.#url; }
}
