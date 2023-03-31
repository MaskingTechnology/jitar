
import { runProcedure } from '../../../src/hooks';

const EXECUTABLES =
{
    // General
    PRIVATE: () => { return 'private'; },
    PUBLIC: () => { return 'public'; },
    PARAMETERS: (mandatory: string, optional = 'default') => { return `${mandatory} ${optional}`; },
    BROKEN: () => { throw new Error('broken'); },
    CONTEXT: () => { return this; },
    V1_0_0: () => { return '1.0.0'; },
    V1_0_5: () => { return '1.0.5'; },
    V1_1_0: () => { return '1.1.0'; },

    // First segment
    FIRST: () => { return 'first'; },
    SECOND: () => { return runProcedure('first', '0.0.0', new Map()); }, // Runs a private task on the same segment
    THIRD: () => { return runProcedure('fourth', '0.0.0', new Map()); }, // Runs a public task on another segment

    // Second segment
    FOURTH: () => { return 'fourth'; },
    FIFTH: () => { return 'fifth'; },
    SIXTH: () => { return runProcedure('first', '0.0.0', new Map()); }, // Runs a private task on another segment
}

Object.freeze(EXECUTABLES);

export { EXECUTABLES };
