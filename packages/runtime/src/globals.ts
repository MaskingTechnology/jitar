
import ProcedureNotAccessible from './errors/ProcedureNotAccessible.js';

import { runProcedure } from './hooks.js';

declare global
{
    const __run: typeof runProcedure;
}

export const globals = globalThis as Record<string, unknown>;

// Available for external use
globals.__run = runProcedure;

// Internal use only
globals.ProcedureNotAccessible = ProcedureNotAccessible;
