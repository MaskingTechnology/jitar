
import { beforeEach, describe, expect, it } from 'vitest';

import { Logger } from '../src';

import { writer, INPUT, OUTPUT } from './fixtures';

beforeEach(() =>
{
    writer.clear();
});

const logger = new Logger(writer);

describe('Logger', () =>
{
    describe('.debug(...messages))', () =>
    {
        it('should log messages when debug is enabled', () =>
        {
            const DebugLogger = new Logger(writer, true);

            DebugLogger.debug('message');
            expect(writer.lastMessage).toEqual('[DEBUG] message');
        });

        it('should not log messages when debug is disabled', () =>
        {
            logger.debug('message');
            expect(writer.lastMessage).toEqual(undefined);
        });
    });

    it('log [CATEGORY] messages', () =>
    {
        logger.info('info');
        logger.warn('warn');
        logger.error('error');
        logger.fatal('fatal');

        expect(writer.messages).toEqual([
            '[INFO] info',
            '[WARN] warn',
            '[ERROR] error',
            '[FATAL] fatal'
        ]);
    });

    describe('.#createMessage()', () =>
    {
        it('should format string message', () =>
        {
            logger.info(INPUT.STRING);
            expect(writer.lastMessage).toEqual(OUTPUT.STRING);
        });

        it('should format number message', () =>
        {
            logger.info(INPUT.NUMBER);
            expect(writer.lastMessage).toEqual(OUTPUT.NUMBER);
        });

        it('should format boolean message', () =>
        {
            logger.info(INPUT.BOOLEAN);
            expect(writer.lastMessage).toEqual(OUTPUT.BOOLEAN);
        });

        it('should format object message', () =>
        {
            logger.info(INPUT.OBJECT);
            expect(writer.lastMessage).toEqual(OUTPUT.OBJECT);
        });

        it('should format array', () =>
        {
            logger.info(INPUT.ARRAY);
            expect(writer.lastMessage).toEqual(OUTPUT.ARRAY);
        });

        it('should format function', () =>
        {
            logger.info(INPUT.FUNCTION);
            expect(writer.lastMessage).toEqual(OUTPUT.FUNCTION);
        });

        it('should format undefined', () =>
        {
            logger.info(INPUT.UNDEFINED);
            expect(writer.lastMessage).toEqual(OUTPUT.UNDEFINED);
        });

        it('should format null', () =>
        {
            logger.info(INPUT.NULL);
            expect(writer.lastMessage).toEqual(OUTPUT.NULL);
        });

        it('should format nested object', () =>
        {
            logger.info(INPUT.NESTED_OBJECT);
            expect(writer.lastMessage).toEqual(OUTPUT.NESTED_OBJECT);
        });

        it('should format nested array', () =>
        {
            logger.info(INPUT.NESTED_ARRAY);
            global.console.log(writer.lastMessage);
            expect(writer.lastMessage).toEqual(OUTPUT.NESTED_ARRAY);
        });

        it('should format error without stacktrace', () =>
        {
            logger.info(INPUT.ERROR_WITHOUT_STACKTRACE);
            global.console.log(writer.lastMessage);
            expect(writer.lastMessage).toEqual(OUTPUT.ERROR_WITHOUT_STACKTRACE);
        });

        it('should format error with stacktrace', () =>
        {
            logger.info(INPUT.ERROR_WITH_STACKTRACE);
            global.console.log(writer.lastMessage);
            expect(writer.lastMessage).toEqual(OUTPUT.ERROR_WITH_STACKTRACE);
        });
    });
});
