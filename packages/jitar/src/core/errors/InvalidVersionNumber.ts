
import Component from '../types/Component.js';

export default class InvalidVersionNumber extends Error
{
    constructor(number: string)
    {
        super(`Invalid version number '${number}'`);
    }
}

(InvalidVersionNumber as Component).source = '/jitar/core/errors/InvalidVersionNumber.js';
