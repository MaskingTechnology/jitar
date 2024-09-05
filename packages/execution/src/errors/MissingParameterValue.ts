
import { BadRequest } from '@jitar/errors';

export default class MissingParameterValue extends BadRequest
{
    #parameterName: string;

    constructor(parameterName: string)
    {
        super(`Missing value for parameter '${parameterName}'`);

        this.#parameterName = parameterName;
    }

    get parameterName() { return this.#parameterName; }
}
