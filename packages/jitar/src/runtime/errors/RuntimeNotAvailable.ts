
import Component from '../../core/types/Component.js';

export default class RuntimeNotAvailable extends Error
{
    constructor()
    {
        super(`Runtime not available`);
    }
}

(RuntimeNotAvailable as Component).source = '/jitar/runtime/errors/RuntimeNotAvailable.js';
