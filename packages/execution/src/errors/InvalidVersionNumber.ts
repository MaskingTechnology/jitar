
import { BadRequest } from '@jitar/errors';

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
