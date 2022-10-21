
import Component from '../../../core/types/Component.js';

export default class ClassNotFound extends Error
{
    constructor(name: string)
    {
        super(`The class '${name}' could not be found`);
    }
}

(ClassNotFound as Component).source = '/jitar/runtime/serialization/errors/ClassNotFound.js';
