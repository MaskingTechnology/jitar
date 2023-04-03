
import { getDependency, runProcedure } from './hooks.js';

const globals = globalThis as Record<string, unknown>;
globals.getDependency = getDependency;
globals.runProcedure = runProcedure;
