
import { Logger } from 'tslog';

export enum LogLevel
{
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    FATAL = 'fatal'
}

export default class LogBuilder
{
    static build(level: string): Logger<unknown>
    {
        const logConfiguration = this.#getLogConfiguration(level);

        return new Logger(logConfiguration);
    }

    static #getLogConfiguration(level: string): object
    {
        const logLevel = this.#getLogLevel(level);

        return {
            prettyLogTemplate: "{{dateIsoStr}}\t{{logLevelName}}\t",
            minLevel: logLevel
        };
    }

    static #getLogLevel(level: string): number
    {
        switch (level)
        {
            case LogLevel.FATAL:
                return 6;
            case LogLevel.ERROR:
                return 5;
            case LogLevel.WARN:
                return 4;
            case LogLevel.INFO:
                return 3;
            default:
                return 2;
        }
    }
}
