
import { Loadable } from 'jitar-serialization';

import ServerError from './generic/ServerError.js';

export default class NoNodeAvailable extends ServerError
{
    #name: string;

    constructor(name: string)
    {
        super(`No node available for procedure '${name}'`);

        this.#name = name;
    }

    get name() { return this.#name; }
}

(NoNodeAvailable as Loadable).source = '/jitar/errors/NoNodeAvailable.js';
