
import { getDependency, runProcedure } from './hooks.js';

const globals = globalThis as Record<string, unknown>;

globals.__getDependency = getDependency;
globals.__runProcedure = runProcedure;
