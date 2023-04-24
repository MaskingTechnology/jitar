
import { ProcedureNotAccessible } from '@jitar/errors';

import { getDependency, runProcedure } from './hooks.js';

declare global
{
    const __getDependency: typeof getDependency;
    const __runProcedure: typeof runProcedure;
}

export const globals = globalThis as Record<string, unknown>;

// Available for external use
globals.__getDependency = getDependency;
globals.__runProcedure = runProcedure;

// Internal use only
globals.ProcedureNotAccessible = ProcedureNotAccessible;
