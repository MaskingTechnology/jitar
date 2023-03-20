
import { describe, expect, it } from 'vitest';
import MissingParameterValue from '../../src/errors/MissingParameterValue';
import UnknownParameter from '../../src/errors/UnknownParameter';

import ArgumentExtractor from '../../src/utils/ArgumentExtractor';

import { PARAMETERS, ARGUMENTS } from '../_fixtures/utils/ArgumentExtractor.fixture';

const argumentExtractor = new ArgumentExtractor();

describe('utils/ArgumentExtractor', () =>
{
    describe('.extract(parameters, args) | Named', () =>
    {
        it('should extract all named parameter values', () =>
        {
            const args = argumentExtractor.extract(PARAMETERS.NAMED, ARGUMENTS.NAMED_ALL);

            expect(args).toHaveLength(3);
            expect(args[0]).toBe(1);
            expect(args[1]).toBe('John Doe');
            expect(args[2]).toBe(42);
        });

        it('should ignore missing optional value for a named parameter', () =>
        {
            const args = argumentExtractor.extract(PARAMETERS.NAMED, ARGUMENTS.NAMED_OPTIONAL);

            expect(args).toHaveLength(2);
            expect(args[0]).toBe(1);
            expect(args[1]).toBe('John Doe');
        });

        it('should throw an error when a value misses for a mandatory named parameter', () =>
        {
            const run = () => argumentExtractor.extract(PARAMETERS.NAMED, ARGUMENTS.NAMED_MISSING);

            expect(run).toThrowError(new MissingParameterValue('name'));
        });

        it('should throw an error when an unknown argument is given as named parameter', () =>
        {
            const run = () => argumentExtractor.extract(PARAMETERS.NAMED, ARGUMENTS.NAMED_EXTRA);

            expect(run).toThrowError(new UnknownParameter('extra'));
        });
    });

    describe('.extract(parameters, args) | Array', () =>
    {
        it('should extract all array parameter values', () =>
        {
            const args = argumentExtractor.extract(PARAMETERS.ARRAY, ARGUMENTS.ARRAY_ALL);

            expect(args).toHaveLength(1);
            expect(args[0]).toHaveLength(2);
            expect(args[0]).toBeInstanceOf(Array);

            const array = args[0] as unknown[];
            expect(array[0]).toBe('foo');
            expect(array[1]).toBe('bar');
        });

        it('should ignore missing optional value for an array parameter', () =>
        {
            const args = argumentExtractor.extract(PARAMETERS.ARRAY, ARGUMENTS.ARRAY_OPTIONAL);

            expect(args).toHaveLength(1);
            expect(args[0]).toHaveLength(1);
            expect(args[0]).toBeInstanceOf(Array);

            const array = args[0] as unknown[];
            expect(array[0]).toBe('foo');
        });

        it('should throw an error when a value misses for a mandatory array parameter', () =>
        {
            const run = () => argumentExtractor.extract(PARAMETERS.ARRAY, ARGUMENTS.ARRAY_MISSING);

            expect(run).toThrowError(new MissingParameterValue('query'));
        });

        it('should throw an error when an unknown argument is given in an array parameter', () =>
        {
            const run = () => argumentExtractor.extract(PARAMETERS.ARRAY, ARGUMENTS.ARRAY_EXTRA);

            expect(run).toThrowError(new UnknownParameter('extra'));
        });
    });
});
