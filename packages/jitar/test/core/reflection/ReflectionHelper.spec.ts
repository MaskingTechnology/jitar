
import { describe, expect, it } from 'vitest';

import ReflectionHelper from '../../../src/core/reflection/ReflectionHelper';

import
{
    Person,
    User,
    johnDoe,
    requiredArgedFunction,
    optionalArgedFunction
} from '../../_fixtures/core/reflection/ReflectionHelper.fixture';

describe('core/reflection/ReflectionHelper', () =>
{
    describe('.getClass(object)', () =>
    {
        it('should get the class of an object', () =>
        {
            const result = ReflectionHelper.getObjectClass(johnDoe);

            expect(result.name).toBe('Person');
        });
    });

    describe('.getParentClass(object)', () =>
    {
        it('should get the parent of a class', () =>
        {
            const result = ReflectionHelper.getParentClass(Person);

            expect(result.name).toBe('Human');
        });
    });

    describe('.getFields(class)', () =>
    {
        it('should get all fields of a class', () =>
        {
            const result = ReflectionHelper.getFields(Person);

            expect(result.length).toBe(4);

            expect(result[0].name).toBe('id');
            expect(result[0].canGet).toBe(true);
            expect(result[0].canSet).toBe(true);

            expect(result[1].name).toBe('fullName');
            expect(result[1].canGet).toBe(true);
            expect(result[1].canSet).toBe(false);

            expect(result[2].name).toBe('age');
            expect(result[2].canGet).toBe(true);
            expect(result[2].canSet).toBe(false);

            expect(result[3].name).toBe('state');
            expect(result[3].canGet).toBe(false);
            expect(result[3].canSet).toBe(true);
        });
    });

    describe('.getConstructorParameters(class)', () =>
    {
        it('should get the constructor parameters of a class', () =>
        {
            const result = ReflectionHelper.getConstructorParameters(Person);

            expect(result.length).toBe(4);

            expect(result[0].name).toBe('id');
            expect(result[1].name).toBe('firstName');
            expect(result[2].name).toBe('lastName');
            expect(result[3].name).toBe('age');
        });

        it('should get the constructor parameters of the parent class', () =>
        {
            const result = ReflectionHelper.getConstructorParameters(User);

            expect(result.length).toBe(4);

            expect(result[0].name).toBe('id');
            expect(result[1].name).toBe('firstName');
            expect(result[2].name).toBe('lastName');
            expect(result[3].name).toBe('age');
        });
    });

    describe('.getFunctionParameters(function)', () =>
    {
        it('should get the required parameters of a function', () =>
        {
            const result = ReflectionHelper.getFunctionParameters(requiredArgedFunction);

            expect(result.length).toBe(3);

            expect(result[0].name).toBe('a');
            expect(result[0].isOptional).toBe(false);
            expect(result[0].defaultValue).toBe(undefined);

            expect(result[1].name).toBe('b');
            expect(result[1].isOptional).toBe(false);
            expect(result[1].defaultValue).toBe(undefined);

            expect(result[2].name).toBe('c');
            expect(result[2].isOptional).toBe(false);
            expect(result[2].defaultValue).toBe(undefined);
        });

        it('should get the optional parameters of a function', () =>
        {
            const result = ReflectionHelper.getFunctionParameters(optionalArgedFunction);

            expect(result.length).toBe(3);

            expect(result[0].name).toBe('a');
            expect(result[0].isOptional).toBe(false);
            expect(result[0].defaultValue).toBe(undefined);

            expect(result[1].name).toBe('b');
            expect(result[1].isOptional).toBe(true);
            expect(result[1].defaultValue).toBe(`new Person(1, "Jane", "Doe", 42)`);

            expect(result[2].name).toBe('c');
            expect(result[2].isOptional).toBe(true);
            expect(result[2].defaultValue).toBe('0');
        });
    });
});
