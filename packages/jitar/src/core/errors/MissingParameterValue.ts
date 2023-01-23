
import Component from '../types/Component.js';
import BadRequest from './BadRequest.js';

export default class MissingParameterValue extends BadRequest
{
    constructor(parameterName: string)
    {
        super(`Missing value for parameter '${parameterName}'`);
    }
}

(MissingParameterValue as Component).source = '/jitar/core/errors/MissingParameterValue.js';
