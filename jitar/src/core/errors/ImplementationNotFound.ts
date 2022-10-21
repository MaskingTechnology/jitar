
import Component from '../types/Component.js';

export default class ImplementationNotFound extends Error
{
    constructor(fqn: string, version: string)
    {
        super(`No implementation found for procedure '${fqn}' with version '${version}'`);
    }
}

(ImplementationNotFound as Component).source = '/jitar/core/errors/ImplementationNotFound.js';
