
import { BadRequest } from '@jitar/errors';

export default class InvalidParameterValue extends BadRequest
{
    readonly #parameterName: string;

    constructor(parameterName: string)
    {
        super(`Invalid value for parameter '${parameterName}'`);

        this.name = 'InvalidParameterValue';
        
        this.#parameterName = parameterName;
    }

    get parameterName() { return this.#parameterName; }
}
