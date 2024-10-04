
import { LogLevel, LogLevels } from '../definitions/LogLevel';
import InvalidLogLevel from '../errors/InvalidLogLevel';

export default class LogLevelParser
{
    parse(logLevel: string): LogLevel
    {
        switch (logLevel.toUpperCase())
        {
            case 'DEBUG': return LogLevels.DEBUG;
            case 'INFO': return LogLevels.INFO;
            case 'WARN': return LogLevels.WARN;
            case 'ERROR': return LogLevels.ERROR;
            case 'FATAL': return LogLevels.FATAL;
            default: throw new InvalidLogLevel(logLevel);
        }
    }
}
