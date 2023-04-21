
import { Loadable } from '@jitar/serialization';

import createSource from '../sourcing.js';

import BadRequest from '../generic/BadRequest.js';

export default class InvalidVersionNumber extends BadRequest
{
    #number: string;

    constructor(number: string)
    {
        super(`Invalid version number '${number}'`);

        this.#number = number;
    }

    get number() { return this.#number; }
}

(InvalidVersionNumber as Loadable).source = createSource(import.meta.url);
