
import { describe, expect, it } from 'vitest';
import MissingParameterValue from '../../src/errors/MissingParameterValue';
import UnknownParameter from '../../src/errors/UnknownParameter';

import ArgumentConstructor from '../../src/utils/ArgumentConstructor';

import { PARAMETERS, ARGUMENTS } from '../_fixtures/utils/ArgumentConstructor.fixture';

const argumentConstructor = new ArgumentConstructor();

describe('utils/ArgumentExtractor', () =>
{
    describe('.extract(parameters, args) | Named', () =>
    {
        it('should extract all named parameter values', () =>
        {
            const args = argumentConstructor.extract(PARAMETERS.NAMED, ARGUMENTS.NAMED_ALL);

            expect(args).toHaveLength(3);
            expect(args[0]).toBe(1);
            expect(args[1]).toBe('John Doe');
            expect(args[2]).toBe(42);
        });

        it('should ignore missing optional value for a named parameter', () =>
        {
            const args = argumentConstructor.extract(PARAMETERS.NAMED, ARGUMENTS.NAMED_OPTIONAL);

            expect(args).toHaveLength(3);
            expect(args[0]).toBe(1);
            expect(args[1]).toBe('John Doe');
            expect(args[2]).toBeUndefined();
        });

        it('should throw an error when a value misses for a mandatory named parameter', () =>
        {
            const run = () => argumentConstructor.extract(PARAMETERS.NAMED, ARGUMENTS.NAMED_MISSING);

            expect(run).toThrowError(new MissingParameterValue('name'));
        });

        it('should throw an error when an unknown argument is given as named parameter', () =>
        {
            const run = () => argumentConstructor.extract(PARAMETERS.NAMED, ARGUMENTS.NAMED_EXTRA);

            expect(run).toThrowError(new UnknownParameter('extra'));
        });
    });

    describe('.extract(parameters, args) | Array', () =>
    {
        it('should extract all array parameter values', () =>
        {
            const args = argumentConstructor.extract(PARAMETERS.ARRAY, ARGUMENTS.DESTRUCTURED_ALL);

            expect(args).toHaveLength(1);
            expect(args[0]).toBeInstanceOf(Array);
            expect(args[0]).toHaveLength(2);

            const array = args[0] as unknown[];
            expect(array[0]).toBe('foo');
            expect(array[1]).toBe('bar');
        });

        it('should ignore missing optional value for an array parameter', () =>
        {
            const args = argumentConstructor.extract(PARAMETERS.ARRAY, ARGUMENTS.DESTRUCTURED_OPTIONAL);

            expect(args).toHaveLength(1);
            expect(args[0]).toBeInstanceOf(Array);
            expect(args[0]).toHaveLength(2);

            const array = args[0] as unknown[];
            expect(array[0]).toBe('foo');
            expect(array[1]).toBeUndefined();
        });

        it('should throw an error when a value misses for a mandatory array parameter', () =>
        {
            const run = () => argumentConstructor.extract(PARAMETERS.ARRAY, ARGUMENTS.DESTRUCTURED_MISSING);

            expect(run).toThrowError(new MissingParameterValue('query'));
        });

        it('should throw an error when an unknown argument is given in an array parameter', () =>
        {
            const run = () => argumentConstructor.extract(PARAMETERS.ARRAY, ARGUMENTS.DESTRUCTURED_EXTRA);

            expect(run).toThrowError(new UnknownParameter('extra'));
        });
    });

    describe('.extract(parameters, args) | Object', () =>
    {
        it('should extract all array parameter values', () =>
        {
            const args = argumentConstructor.extract(PARAMETERS.OBJECT, ARGUMENTS.DESTRUCTURED_ALL);

            expect(args).toHaveLength(1);
            expect(args[0]).toBeInstanceOf(Object);
            
            const object = args[0] as object;
            expect(object['query']).toBe('foo');
            expect(object['sort']).toBe('bar');
        });

        it('should ignore missing optional value for an array parameter', () =>
        {
            const args = argumentConstructor.extract(PARAMETERS.OBJECT, ARGUMENTS.DESTRUCTURED_OPTIONAL);

            expect(args).toHaveLength(1);
            expect(args[0]).toBeInstanceOf(Object);
            
            const object = args[0] as object;
            expect(object['query']).toBe('foo');
            expect(object['sort']).toBeUndefined();
        });

        it('should throw an error when a value misses for a mandatory array parameter', () =>
        {
            const run = () => argumentConstructor.extract(PARAMETERS.OBJECT, ARGUMENTS.DESTRUCTURED_MISSING);

            expect(run).toThrowError(new MissingParameterValue('query'));
        });

        it('should throw an error when an unknown argument is given in an array parameter', () =>
        {
            const run = () => argumentConstructor.extract(PARAMETERS.OBJECT, ARGUMENTS.DESTRUCTURED_EXTRA);

            expect(run).toThrowError(new UnknownParameter('extra'));
        });
    });
});
