
import Component from '../../core/types/Component.js';

export default class NoNodeAvailable extends Error
{
    constructor(name: string)
    {
        super(`No node available for procedure '${name}'`);
    }
}

(NoNodeAvailable as Component).source = '/jitar/runtime/errors/NoNodeAvailable.js';
