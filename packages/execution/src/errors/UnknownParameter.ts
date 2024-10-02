
import { BadRequest } from '@jitar/errors';

export default class UnknownParameter extends BadRequest
{
    #parameterName: string;

    constructor(parameterName: string)
    {
        super(`Unknown parameter ${parameterName}`);

        this.#parameterName = parameterName;
    }

    get parameterName() { return this.#parameterName; }
}
