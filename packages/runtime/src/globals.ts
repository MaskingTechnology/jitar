
import { Forbidden } from '@jitar/errors';

import { runProcedure } from './hooks.js';

export class ProcedureNotAccessible extends Forbidden
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

declare global
{
    const __run: typeof runProcedure;
}

export const globals = globalThis as Record<string, unknown>;

// Available for external use
globals.__run = runProcedure;

// Internal use only
globals.ProcedureNotAccessible = ProcedureNotAccessible;
