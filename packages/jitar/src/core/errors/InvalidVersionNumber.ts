
import Component from '../types/Component.js';
import InvalidRequest from './InvalidRequest.js';

export default class InvalidVersionNumber extends InvalidRequest
{
    constructor(number: string)
    {
        super(`Invalid version number '${number}'`);
    }
}

(InvalidVersionNumber as Component).source = '/jitar/core/errors/InvalidVersionNumber.js';
