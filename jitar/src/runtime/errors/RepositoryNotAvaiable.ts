
import Component from '../../core/types/Component.js';

export default class RepositoryNotAvailable extends Error
{
    constructor()
    {
        super(`Repository not available`);
    }
}

(RepositoryNotAvailable as Component).source = '/jitar/runtime/errors/RepositoryNotAvailable.js';
