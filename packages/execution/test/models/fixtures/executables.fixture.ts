
export const EXECUTABLES =
{
    PRIVATE: () => { return 'private'; },
    PROTECTED: () => { return 'protected'; },
    PUBLIC: () => { return 'public'; },
    PARAMETERS: (mandatory: string, optional = 'default') => { return `${mandatory} ${optional}`; },
    BROKEN: () => { throw new Error('broken'); },
    CONTEXT: () => { return this; },
    V1_0_0: () => { return '1.0.0'; },
    V1_0_5: () => { return '1.0.5'; },
    V1_1_0: () => { return '1.1.0'; }
};
