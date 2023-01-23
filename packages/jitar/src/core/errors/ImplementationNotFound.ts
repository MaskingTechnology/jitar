
import Component from '../types/Component.js';
import NotFound from './NotFound.js';

export default class ImplementationNotFound extends NotFound
{
    constructor(fqn: string, version: string)
    {
        super(`No implementation found for procedure '${fqn}' with version '${version}'`);
    }
}

(ImplementationNotFound as Component).source = '/jitar/core/errors/ImplementationNotFound.js';
