
import { describe, expect, it } from 'vitest';

import { LogLevels } from '../../src/definitions/LogLevel';
import InvalidLogLevel from '../../src/errors/InvalidLogLevel';
import LogLevelParser from '../../src/utils/LogLevelParser';

const logLevelParser = new LogLevelParser();

describe('utils/LogLevelParser', () =>
{
    describe('.parse(logLevel)', () =>
    {
        it('should parse a debug log level', () =>
        {
            const logLevel = logLevelParser.parse('DEBUG');

            expect(logLevel).toEqual(LogLevels.DEBUG);
        });

        it('should parse an info log level', () =>
        {
            const logLevel = logLevelParser.parse('INFO');

            expect(logLevel).toEqual(LogLevels.INFO);
        });

        it('should parse a warn log level', () =>
        {
            const logLevel = logLevelParser.parse('WARN');

            expect(logLevel).toEqual(LogLevels.WARN);
        });

        it('should parse an error log level', () =>
        {
            const logLevel = logLevelParser.parse('ERROR');

            expect(logLevel).toEqual(LogLevels.ERROR);
        });

        it('should parse a fatal log level', () =>
        {
            const logLevel = logLevelParser.parse('FATAL');

            expect(logLevel).toEqual(LogLevels.FATAL);
        });

        it('should not parse an invalid log level', () =>
        {
            const run = () => logLevelParser.parse('all');

            expect(run).toThrow(new InvalidLogLevel('all'));
        });

        it('should parse log levels case insensitive', () =>
        {
            const logLevel = logLevelParser.parse('fatal');

            expect(logLevel).toEqual(LogLevels.FATAL);
        });
    });
});
