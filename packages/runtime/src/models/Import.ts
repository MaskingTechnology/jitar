
import { ExecutionScope } from '../definitions/ExecutionScope.js';

export default class Import
{
    #caller: string;
    #specifier: string;
    #scope: ExecutionScope;
    #extractDefault: boolean;

    constructor(caller: string, specifier: string, scope: ExecutionScope, extractDefault: boolean = true)
    {
        this.#caller = caller;
        this.#specifier = specifier;
        this.#scope = scope;
        this.#extractDefault =  extractDefault;
    }

    get caller() { return this.#caller; }

    get specifier() { return this.#specifier; }

    get scope() { return this.#scope; }

    get extractDefault() { return this.#extractDefault; }
}
