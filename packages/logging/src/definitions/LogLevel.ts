
const LogLevels =
    {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3,
        FATAL: 4
    } as const;

type Keys = keyof typeof LogLevels;
type LogLevel = typeof LogLevels[Keys];

export { LogLevel, LogLevels };

