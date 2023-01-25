
import Component from '../types/Component.js';
import BadRequest from './BadRequest.js';

export default class InvalidVersionNumber extends BadRequest
{
    constructor(number: string)
    {
        super(`Invalid version number '${number}'`);
    }
}

(InvalidVersionNumber as Component).source = '/jitar/core/errors/InvalidVersionNumber.js';
