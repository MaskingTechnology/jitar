
import { ExecutionScope } from '../definitions/ExecutionScope.js';

export default class Import
{
    #specifier: string;
    #scope: ExecutionScope;
    #extractDefault: boolean;
    #source?: string;

    constructor(specifier: string, scope: ExecutionScope, extractDefault: boolean = true, source?: string)
    {
        this.#specifier = specifier;
        this.#scope = scope;
        this.#extractDefault =  extractDefault;
        this.#source = source;
    }

    get specifier() { return this.#specifier; }

    get scope() { return this.#scope; }

    get extractDefault() { return this.#extractDefault; }

    get source() { return this.#source; }
}
