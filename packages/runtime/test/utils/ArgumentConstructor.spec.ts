
import { describe, expect, it } from 'vitest';

import InvalidParameterValue from '../../src/errors/InvalidParameterValue';
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

    describe('.extract(parameters, args) | Mixed', () =>
    {
        it('should extract mixed parameter values', () =>
        {
            const args = argumentConstructor.extract(PARAMETERS.MIXED, ARGUMENTS.MIXED_ALL);

            expect(args).toHaveLength(3);
            expect(args[0]).toBeTypeOf('number');
            expect(args[1]).toBeInstanceOf(Array);
            expect(args[2]).toBeInstanceOf(Object);
            
            expect(args[0]).toBe(1);

            const array = args[1] as unknown[];
            expect(array).toHaveLength(2);
            expect(array[0]).toBe('John Doe');
            expect(array[1]).toBe(42);

            const object = args[2] as object;
            expect(object['query']).toBe('foo');
            expect(object['sort']).toBe('bar');
        });

        it('should ignore missing optional value for a mixed parameter', () =>
        {
            const args = argumentConstructor.extract(PARAMETERS.MIXED, ARGUMENTS.MIXED_OPTIONAL);

            expect(args).toHaveLength(3);
            expect(args[0]).toBeTypeOf('number');
            expect(args[1]).toBeInstanceOf(Array);
            expect(args[2]).toBeInstanceOf(Object);
            
            expect(args[0]).toBe(1);

            const array = args[1] as unknown[];
            expect(array).toHaveLength(2);
            expect(array[0]).toBe('John Doe');
            expect(array[1]).toBeUndefined();

            const object = args[2] as object;
            expect(object['query']).toBe('foo');
            expect(object['sort']).toBeUndefined();
        });

        it('should throw an error when a value misses for a mandatory mixed parameter', () =>
        {
            const run = () => argumentConstructor.extract(PARAMETERS.MIXED, ARGUMENTS.MIXED_MISSING);

            expect(run).toThrowError(new MissingParameterValue('name'));
        });

        it('should throw an error when an unknown argument is given in a mixed parameter', () =>
        {
            const run = () => argumentConstructor.extract(PARAMETERS.MIXED, ARGUMENTS.MIXED_EXTRA);

            expect(run).toThrowError(new UnknownParameter('extra'));
        });
    });

    describe('.extract(parameters, args) | Nested array', () =>
    {
        it('should extract all nested array parameter values', () =>
        {
            const args = argumentConstructor.extract(PARAMETERS.NESTED_ARRAY, ARGUMENTS.NESTED_ALL);

            expect(args).toHaveLength(1);
            expect(args[0]).toBeInstanceOf(Array);
            
            const array = args[0] as unknown[];
            expect(array).toHaveLength(3);
            expect(array[0]).toBeTypeOf('number');
            expect(array[1]).toBeInstanceOf(Array);
            expect(array[2]).toBeInstanceOf(Object);
            
            expect(array[0]).toBe(1);

            const innerArray = array[1] as unknown[];
            expect(innerArray).toHaveLength(2);
            expect(innerArray[0]).toBe('John Doe');
            expect(innerArray[1]).toBe(42);

            const innerObject = array[2] as object;
            expect(innerObject['query']).toBe('foo');
            expect(innerObject['sort']).toBe('bar');
        });

        it('should ignore missing optional value for a nested array parameter', () =>
        {
            const args = argumentConstructor.extract(PARAMETERS.NESTED_ARRAY, ARGUMENTS.NESTED_OPTIONAL);

            expect(args).toHaveLength(1);
            expect(args[0]).toBeInstanceOf(Array);
            
            const array = args[0] as unknown[];
            expect(array).toHaveLength(3);
            expect(array[0]).toBeTypeOf('number');
            expect(array[1]).toBeInstanceOf(Array);
            expect(array[2]).toBeUndefined();
            
            expect(array[0]).toBe(1);

            const innerArray = array[1] as unknown[];
            expect(innerArray).toHaveLength(2);
            expect(innerArray[0]).toBe('John Doe');
            expect(innerArray[1]).toBeUndefined();
        });

        it('should throw an error when a value misses for a mandatory nested array parameter', () =>
        {
            const run = () => argumentConstructor.extract(PARAMETERS.NESTED_ARRAY, ARGUMENTS.NESTED_MISSING);

            expect(run).toThrowError(new MissingParameterValue('sort'));
        });

        it('should throw an error when an unknown argument is given in a nested array parameter', () =>
        {
            const run = () => argumentConstructor.extract(PARAMETERS.NESTED_ARRAY, ARGUMENTS.NESTED_EXTRA);

            expect(run).toThrowError(new UnknownParameter('extra'));
        });
    });

    describe('.extract(parameters, args) | Nested object', () =>
    {
        it('should extract all nested object parameter values', () =>
        {
            const args = argumentConstructor.extract(PARAMETERS.NESTED_OBJECT, ARGUMENTS.NESTED_ALL);

            expect(args).toHaveLength(1);
            expect(args[0]).toBeInstanceOf(Object);
            
            const object = args[0] as object;
            expect(object['id']).toBeTypeOf('number');
            expect(object['person']).toBeInstanceOf(Array);
            expect(object['filter']).toBeInstanceOf(Object);
            
            expect(object['id']).toBe(1);

            const innerArray = object['person'] as unknown[];
            expect(innerArray).toHaveLength(2);
            expect(innerArray[0]).toBe('John Doe');
            expect(innerArray[1]).toBe(42);

            const innerObject = object['filter'] as object;
            expect(innerObject['query']).toBe('foo');
            expect(innerObject['sort']).toBe('bar');
        });

        it('should ignore missing optional value for a nested object parameter', () =>
        {
            const args = argumentConstructor.extract(PARAMETERS.NESTED_OBJECT, ARGUMENTS.NESTED_OPTIONAL);

            expect(args).toHaveLength(1);
            expect(args[0]).toBeInstanceOf(Object);
            
            const object = args[0] as object;
            expect(object['id']).toBeTypeOf('number');
            expect(object['person']).toBeInstanceOf(Array);
            expect(object['filter']).toBeUndefined();
            
            expect(object['id']).toBe(1);

            const innerArray = object['person'] as unknown[];
            expect(innerArray).toHaveLength(2);
            expect(innerArray[0]).toBe('John Doe');
            expect(innerArray[1]).toBeUndefined();
        });

        it('should throw an error when a value misses for a mandatory nested object parameter', () =>
        {
            const run = () => argumentConstructor.extract(PARAMETERS.NESTED_OBJECT, ARGUMENTS.NESTED_MISSING);

            expect(run).toThrowError(new MissingParameterValue('sort'));
        });

        it('should throw an error when an unknown argument is given in a nested object parameter', () =>
        {
            const run = () => argumentConstructor.extract(PARAMETERS.NESTED_OBJECT, ARGUMENTS.NESTED_EXTRA);

            expect(run).toThrowError(new UnknownParameter('extra'));
        });
    });

    describe('.extract(parameters, args) | Rest parameter', () =>
    {
        it('should extract all nested rest parameter values', () =>
        {
            const args = argumentConstructor.extract(PARAMETERS.REST, ARGUMENTS.REST_VALID);

            expect(args).toHaveLength(1);
            expect(args[0]).toBeInstanceOf(Array);
            
            const array = args[0] as unknown[];
            expect(array).toHaveLength(2);
            expect(array[0]).toBe('foo');
            expect(array[1]).toBe('bar');
        });

        it('should throw an error when a rest parameter value is invalid', () =>
        {
            const run = () => argumentConstructor.extract(PARAMETERS.REST, ARGUMENTS.REST_INVALID);

            expect(run).toThrowError(new InvalidParameterValue('...rest'));
        });
    });

    describe('.extract(parameters, args) | Array rest parameter', () =>
    {
        it('should extract all nested array rest parameter values', () =>
        {
            const args = argumentConstructor.extract(PARAMETERS.REST_ARRAY, ARGUMENTS.REST_ARRAY_VALID);

            expect(args).toHaveLength(1);
            expect(args[0]).toBeInstanceOf(Array);

            const array = args[0] as unknown[];
            expect(array).toHaveLength(2);
            expect(array[0]).toBeTypeOf('string');
            expect(array[1]).toBeInstanceOf(Array);
            
            const restArray = array[1] as unknown[];
            expect(restArray).toHaveLength(2);
            expect(restArray[0]).toBe('foo');
            expect(restArray[1]).toBe('bar');
        });

        it('should throw an error when a array rest parameter value is invalid', () =>
        {
            const run = () => argumentConstructor.extract(PARAMETERS.REST, ARGUMENTS.REST_INVALID);

            expect(run).toThrowError(new InvalidParameterValue('...rest'));
        });
    });

    describe('.extract(parameters, args) | Object rest parameter', () =>
    {
        it('should extract all nested object rest parameter values', () =>
        {
            const args = argumentConstructor.extract(PARAMETERS.REST_OBJECT, ARGUMENTS.REST_OBJECT_VALID);

            expect(args).toHaveLength(1);
            expect(args[0]).toBeInstanceOf(Object);

            const object = args[0] as object;
            expect(object['name']).toBeTypeOf('string');
            expect(object['...rest']).toBeInstanceOf(Object);
            
            const restObject = object['...rest'] as object;
            expect(restObject['first']).toBe('foo');
            expect(restObject['second']).toBe('bar');
        });

        it('should throw an error when a object rest parameter value is invalid', () =>
        {
            const run = () => argumentConstructor.extract(PARAMETERS.REST_OBJECT, ARGUMENTS.REST_OBJECT_INVALID);

            expect(run).toThrowError(new InvalidParameterValue('...rest'));
        });
    });

    describe('.extract(parameters, args) | Optional arguments', () =>
    {
        it('should extract all optional arguments', () =>
        {
            const args = argumentConstructor.extract(PARAMETERS.NAMED, ARGUMENTS.OPTIONAL_ARGUMENTS);

            expect(args).toHaveLength(3);
            expect(args[0]).toBe(1);
            expect(args[1]).toBe('John Doe');
            expect(args[2]).toBe(42);
        });

        it('should extract used optional arguments', () =>
        {
            const args = argumentConstructor.extract(PARAMETERS.NAMED, ARGUMENTS.OPTIONAL_ARGUMENTS_EXTRA);

            expect(args).toHaveLength(3);
            expect(args[0]).toBe(1);
            expect(args[1]).toBe('John Doe');
            expect(args[2]).toBe(undefined);
        });
    });
});
