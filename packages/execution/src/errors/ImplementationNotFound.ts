
import { NotFound } from '@jitar/errors';

export default class ImplementationNotFound extends NotFound
{
    readonly #fqn: string;
    readonly #version: string;

    constructor(fqn: string, version: string)
    {
        super(`No implementation found for procedure '${fqn}' with version '${version}'`);

        this.name = 'ImplementationNotFound';
        
        this.#fqn = fqn;
        this.#version = version;
    }

    get fqn() { return this.#fqn; }

    get version() { return this.#version; }
}
