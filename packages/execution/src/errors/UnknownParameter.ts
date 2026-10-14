
import { BadRequest } from '@jitar/errors';

export default class UnknownParameter extends BadRequest
{
    readonly #parameterName: string;

    constructor(parameterName: string)
    {
        super(`Unknown parameter ${parameterName}`);

        this.name = 'UnknownParameter';
        
        this.#parameterName = parameterName;
    }

    get parameterName() { return this.#parameterName; }
}
