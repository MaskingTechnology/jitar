
import Component from '../types/Component.js';
import InvalidRequest from './InvalidRequest.js';

export default class MissingParameterValue extends InvalidRequest
{
    constructor(parameterName: string)
    {
        super(`Missing value for parameter '${parameterName}'`);
    }
}

(MissingParameterValue as Component).source = '/jitar/core/errors/MissingParameterValue.js';
