
import Component from '../../core/types/Component.js';

export default class ModuleNotLoaded extends Error
{
    constructor(url: string, message?: string)
    {
        super(`Module '${url}' could not be loaded${message !== undefined ? ` | ${message}` : ''}`);
    }
}

(ModuleNotLoaded as Component).source = '/jitar/runtime/errors/ModuleNotLoaded.js';
