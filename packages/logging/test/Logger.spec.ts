
import { beforeEach, describe, expect, it } from 'vitest';

import { Logger } from '../src';

import { LOGGERS, writer, INPUT, OUTPUT } from './fixtures';

const normalLogger = LOGGERS.NORMAL;
const debugLogger = LOGGERS.DEBUG;

beforeEach(() =>
{
    writer.clear();
});

describe('Logger', () =>
{
    describe('Message creation', () =>
    {
        const logger = new Logger(false, writer);

        it('should log [CATEGORY] messages', () =>
        {
            normalLogger.info('info');
            normalLogger.warn('warn');
            normalLogger.error('error');
            normalLogger.fatal('fatal');

            expect(writer.messages).toEqual([
                '[INFO] info',
                '[WARN] warn',
                '[ERROR] error',
                '[FATAL] fatal'
            ]);
        });
    
        it('should format string message', () =>
        {
            normalLogger.info(INPUT.STRING);

            expect(writer.lastMessage).toEqual(OUTPUT.STRING);
        });

        it('should format number message', () =>
        {
            normalLogger.info(INPUT.NUMBER);

            expect(writer.lastMessage).toEqual(OUTPUT.NUMBER);
        });

        it('should format boolean message', () =>
        {
            normalLogger.info(INPUT.BOOLEAN);

            expect(writer.lastMessage).toEqual(OUTPUT.BOOLEAN);
        });

        it('should format object message', () =>
        {
            normalLogger.info(INPUT.OBJECT);

            expect(writer.lastMessage).toEqual(OUTPUT.OBJECT);
        });

        it('should format array', () =>
        {
            normalLogger.info(INPUT.ARRAY);

            expect(writer.lastMessage).toEqual(OUTPUT.ARRAY);
        });

        it('should format function', () =>
        {
            normalLogger.info(INPUT.FUNCTION);

            expect(writer.lastMessage).toEqual(OUTPUT.FUNCTION);
        });

        it('should format undefined', () =>
        {
            normalLogger.info(INPUT.UNDEFINED);

            expect(writer.lastMessage).toEqual(OUTPUT.UNDEFINED);
        });

        it('should format null', () =>
        {
            normalLogger.info(INPUT.NULL);

            expect(writer.lastMessage).toEqual(OUTPUT.NULL);
        });

        it('should format nested object', () =>
        {
            normalLogger.info(INPUT.NESTED_OBJECT);

            expect(writer.lastMessage).toEqual(OUTPUT.NESTED_OBJECT);
        });

        it('should format nested array', () =>
        {
            normalLogger.info(INPUT.NESTED_ARRAY);
            
            expect(writer.lastMessage).toEqual(OUTPUT.NESTED_ARRAY);
        });

        it('should format error without stacktrace', () =>
        {
            normalLogger.info(INPUT.ERROR_WITHOUT_STACKTRACE);
            
            expect(writer.lastMessage).toEqual(OUTPUT.ERROR_WITHOUT_STACKTRACE);
        });

        it('should format error with stacktrace', () =>
        {
            logger.info(INPUT.ERROR_WITH_STACKTRACE);
            
            expect(writer.lastMessage).toEqual(OUTPUT.ERROR_WITH_STACKTRACE);
        });
    });

    describe('Debug mode', () =>
    {
        it('should log messages when debug is enabled', () =>
        {
            debugLogger.debug('message');

            expect(writer.lastMessage).toEqual('[DEBUG] message');
        });

        it('should not log messages when debug is disabled', () =>
        {
            normalLogger.debug('message');

            expect(writer.lastMessage).toEqual(undefined);
        });
    });
});
