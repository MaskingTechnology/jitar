
import { Loadable } from '@jitar/serialization';

import createSource from '../sourcing.js';

import Forbidden from '../generic/Forbidden.js';

export default class ProcedureNotAccessible extends Forbidden
{
    #fqn: string;
    #versionNumber: string;

    constructor(fqn: string, versionNumber: string)
    {
        super(`Procedure '${fqn}' (v${versionNumber}) is not accessible`);

        this.#fqn = fqn;
        this.#versionNumber = versionNumber;
    }

    get fqn() { return this.#fqn; }

    get versionNumber() { return this.#versionNumber; }
}

(ProcedureNotAccessible as Loadable).source = createSource(import.meta.url);
