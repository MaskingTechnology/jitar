
import Component from '../types/Component.js';

export default class MissingParameterValue extends Error
{
    constructor(parameterName: string)
    {
        super(`Missing value for parameter '${parameterName}'`);
    }
}

(MissingParameterValue as Component).source = '/jitar/core/errors/MissingParameterValue.js';
