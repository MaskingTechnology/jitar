
import { beforeEach, describe, expect, it } from 'vitest';

import { INPUT, LOGGERS, OUTPUT, writer } from './fixtures';

beforeEach(() =>
{
    writer.clear();
});

describe('Logger', () =>
{
    describe('.debug(...message)', () =>
    {
        const debugLogger = LOGGERS.DEBUG;

        it('should log DEBUG and above when DEBUG level is set', () =>
        {
            debugLogger.debug(INPUT.STRING);
            expect(writer.messages).toHaveLength(1);

            debugLogger.info(INPUT.STRING);
            expect(writer.messages).toHaveLength(2);

            debugLogger.warn(INPUT.STRING);
            expect(writer.messages).toHaveLength(3);

            debugLogger.error(INPUT.STRING);
            expect(writer.messages).toHaveLength(4);

            debugLogger.fatal(INPUT.STRING);
            expect(writer.messages).toHaveLength(5);
        });

        it('should log [DEBUG] messages', () =>
        {
            debugLogger.debug(INPUT.DEBUG_CATEGORY);
            expect(writer.lastMessage).toMatch(OUTPUT.DEBUG_CATEGORY);
        });
    });

    describe('.info(...message)', () => 
    {
        const infoLogger = LOGGERS.INFO;

        it('should log INFO and above when INFO level is set', () =>
        {
            infoLogger.debug(INPUT.STRING);
            expect(writer.messages).toHaveLength(0);

            infoLogger.info(INPUT.STRING);
            expect(writer.messages).toHaveLength(1);

            infoLogger.warn(INPUT.STRING);
            expect(writer.messages).toHaveLength(2);

            infoLogger.error(INPUT.STRING);
            expect(writer.messages).toHaveLength(3);

            infoLogger.fatal(INPUT.STRING);
            expect(writer.messages).toHaveLength(4);
        });

        it('should log [INFO] messages', () =>
        {
            infoLogger.info(INPUT.INFO_CATEGORY);
            expect(writer.lastMessage).toMatch(OUTPUT.INFO_CATEGORY);
        });
    });

    describe('.warn(...message)', () => 
    {
        const warnLogger = LOGGERS.WARN;

        it('should log WARN and above when WARN level is set', () =>
        {
            warnLogger.debug(INPUT.STRING);
            expect(writer.messages).toHaveLength(0);

            warnLogger.info(INPUT.STRING);
            expect(writer.messages).toHaveLength(0);

            warnLogger.warn(INPUT.STRING);
            expect(writer.messages).toHaveLength(1);

            warnLogger.error(INPUT.STRING);
            expect(writer.messages).toHaveLength(2);

            warnLogger.fatal(INPUT.STRING);
            expect(writer.messages).toHaveLength(3);
        });

        it('should log [WARN] messages', () =>
        {
            warnLogger.warn(INPUT.WARN_CATEGORY);
            expect(writer.lastMessage).toMatch(OUTPUT.WARN_CATEGORY);
        });
    });

    describe('.error(...message)', () => 
    {
        const errorLogger = LOGGERS.ERROR;

        it('should log ERROR and above when ERROR level is set', () =>
        {
            errorLogger.debug(INPUT.STRING);
            expect(writer.messages).toHaveLength(0);

            errorLogger.info(INPUT.STRING);
            expect(writer.messages).toHaveLength(0);

            errorLogger.warn(INPUT.STRING);
            expect(writer.messages).toHaveLength(0);

            errorLogger.error(INPUT.STRING);
            expect(writer.messages).toHaveLength(1);

            errorLogger.fatal(INPUT.STRING);
            expect(writer.messages).toHaveLength(2);
        });

        it('should log [ERROR] messages', () =>
        {
            errorLogger.error(INPUT.ERROR_CATEGORY);
            expect(writer.lastMessage).toMatch(OUTPUT.ERROR_CATEGORY);
        });
    });

    describe('.fatal(...message)', () => 
    {
        const fatalLogger = LOGGERS.FATAL;

        it('should log FATAL and above when FATAL level is set', () =>
        {
            fatalLogger.debug(INPUT.STRING);
            expect(writer.messages).toHaveLength(0);

            fatalLogger.info(INPUT.STRING);
            expect(writer.messages).toHaveLength(0);

            fatalLogger.warn(INPUT.STRING);
            expect(writer.messages).toHaveLength(0);

            fatalLogger.error(INPUT.STRING);
            expect(writer.messages).toHaveLength(0);

            fatalLogger.fatal(INPUT.STRING);
            expect(writer.messages).toHaveLength(1);
        });

        it('should log [FATAL] messages', () =>
        {
            fatalLogger.fatal(INPUT.FATAL_CATEGORY);
            expect(writer.lastMessage).toMatch(OUTPUT.FATAL_CATEGORY);
        });
    });

    describe('Message creation', () =>
    {
        const logger = LOGGERS.INFO;

        it('should format string message', () =>
        {
            logger.info(INPUT.STRING);

            expect(writer.lastMessage).toMatch(OUTPUT.STRING);
        });

        it('should format number message', () =>
        {
            logger.info(INPUT.NUMBER);

            expect(writer.lastMessage).toMatch(OUTPUT.NUMBER);
        });

        it('should format boolean message', () =>
        {
            logger.info(INPUT.BOOLEAN);

            expect(writer.lastMessage).toMatch(OUTPUT.BOOLEAN);
        });

        it('should format object message', () =>
        {
            logger.info(INPUT.OBJECT);

            expect(writer.lastMessage).toMatch(OUTPUT.OBJECT);
        });

        it('should format array', () =>
        {
            logger.info(INPUT.ARRAY);

            expect(writer.lastMessage).toMatch(OUTPUT.ARRAY);
        });

        it('should format function', () =>
        {
            logger.info(INPUT.FUNCTION);

            expect(writer.lastMessage).toMatch(OUTPUT.FUNCTION);
        });

        it('should format undefined', () =>
        {
            logger.info(INPUT.UNDEFINED);

            expect(writer.lastMessage).toMatch(OUTPUT.UNDEFINED);
        });

        it('should format null', () =>
        {
            logger.info(INPUT.NULL);

            expect(writer.lastMessage).toMatch(OUTPUT.NULL);
        });

        it('should format nested object', () =>
        {
            logger.info(INPUT.NESTED_OBJECT);

            expect(writer.lastMessage).toMatch(OUTPUT.NESTED_OBJECT);
        });

        it('should format nested array', () =>
        {
            logger.info(INPUT.NESTED_ARRAY);

            expect(writer.lastMessage).toMatch(OUTPUT.NESTED_ARRAY);
        });

        it('should format error without stacktrace', () =>
        {
            logger.info(INPUT.ERROR_WITHOUT_STACKTRACE);

            expect(writer.lastMessage).toMatch(OUTPUT.ERROR_WITHOUT_STACKTRACE);
        });

        it('should format error with stacktrace', () =>
        {
            logger.info(INPUT.ERROR_WITH_STACKTRACE);

            expect(writer.lastMessage).toMatch(OUTPUT.ERROR_WITH_STACKTRACE);
        });
    });
});
