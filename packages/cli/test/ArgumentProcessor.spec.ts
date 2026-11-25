
import { describe, expect, it } from 'vitest';

import ArgumentProcessor from '../src/ArgumentProcessor';

import { ARGUMENTS } from './fixtures';

const processor = new ArgumentProcessor(ARGUMENTS);

describe('ArgumentProcessor', () =>
{
    describe('.getCommand()', () =>
    {
        it('should get third argument as command', () =>
        {
            const commandName = processor.getCommand();

            expect(commandName).toEqual('commandName');
        });
    });

    describe('.getRequiredArgument(key)', () =>
    {
        it('should return required argument value', () =>
        {
            const value = processor.getRequiredArgument('first');

            expect(value).toEqual('1');
        });

        it('should throw error when required argument value is missing', () =>
        {
            const run = () => processor.getRequiredArgument('second');

            expect(run).toThrow(new Error("Missing argument 'second'"));
        });

        it('should throw error when required argument key is missing', () =>
        {
            const run = () => processor.getRequiredArgument('third');

            expect(run).toThrow(new Error("Missing argument 'third'"));
        });
    });

    describe('.getOptionalArgument(key, defaultValue)', () =>
    {
        it('should return default value if optional value is missing', () =>
        {
            const value = processor.getOptionalArgument('second', 'default');

            expect(value).toEqual('default');
        });

        it('should return default value if optional key is missing', () =>
        {
            const value = processor.getOptionalArgument('third', 'default');

            expect(value).toEqual('default');
        });
    });
});
