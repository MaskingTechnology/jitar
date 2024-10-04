
import { LogLevels } from '../../src';
import Logger from '../../src/Logger';

import { writer } from './writer.fixture';

const debugLogger = new Logger(LogLevels.DEBUG, writer);
const infoLogger = new Logger(LogLevels.INFO, writer);
const warnLogger = new Logger(LogLevels.WARN, writer);
const errorLogger = new Logger(LogLevels.ERROR, writer);
const fatalLogger = new Logger(LogLevels.FATAL, writer);

export const LOGGERS =
{
    DEBUG: debugLogger,
    INFO: infoLogger,
    WARN: warnLogger,
    ERROR: errorLogger,
    FATAL: fatalLogger
};
