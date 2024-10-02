
import Logger from '../../src/Logger';

import { writer } from './writer.fixture';

const normalLogger = new Logger(false, writer);
const debugLogger = new Logger(true, writer);

export const LOGGERS =
{
    NORMAL: normalLogger,
    DEBUG: debugLogger
};
