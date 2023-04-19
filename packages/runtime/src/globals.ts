
import { getDependency, runProcedure } from './hooks.js';
import ProcedureNotAccessible from './errors/ProcedureNotAccessible.js';

declare global
{
    const __getDependency: typeof getDependency;
    const __runProcedure: typeof runProcedure;
}

const globals = globalThis as Record<string, unknown>;

// Available for external use
globals.__getDependency = getDependency;
globals.__runProcedure = runProcedure;

// Internal use only
globals.ProcedureNotAccessible = ProcedureNotAccessible;
