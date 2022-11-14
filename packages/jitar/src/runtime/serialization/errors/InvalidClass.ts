
import Component from '../../../core/types/Component.js';

export default class InvalidClass extends Error
{
    constructor(name: string)
    {
        super(`The class '${name}' is invalid`);
    }
}

(InvalidClass as Component).source = '/jitar/runtime/serialization/errors/InvalidClass.js';
