
import Component from '../../core/types/Component.js';

export default class InvalidJitarHooks extends Error
{
    constructor()
    {
        super(`Invalid Jitar hooks`);
    }
}

(InvalidJitarHooks as Component).source = '/jitar/runtime/errors/InvalidJitarHooks.js';
