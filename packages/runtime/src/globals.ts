
import { getDependency, runProcedure } from './hooks.js';
import ProcedureNotAccessible from './errors/ProcedureNotAccessible.js';

const globals = globalThis as Record<string, unknown>;

globals.__getDependency = getDependency;
globals.__runProcedure = runProcedure;
globals.ProcedureNotAccessible = ProcedureNotAccessible;
