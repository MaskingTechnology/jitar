
import ReflectionField from '../../src/models/ReflectionField';
import ReflectionFunction from '../../src/models/ReflectionFunction';
import ReflectionGetter from '../../src/models/ReflectionGetter';
import ReflectionSetter from '../../src/models/ReflectionSetter';

import { reflectionClass } from '../_fixtures/models/ReflectionClass.fixture';

describe('models/ReflectionClass', () =>
{
    describe('.fields', () =>
    {
        it('should filter field members', () =>
        {
            const fields = reflectionClass.fields;
            expect(fields.length).toBe(4);

            expect(fields[0]).toBeInstanceOf(ReflectionField);
            expect(fields[0].name).toBe('name');

            expect(fields[1]).toBeInstanceOf(ReflectionField);
            expect(fields[1].name).toBe('age');

            expect(fields[2]).toBeInstanceOf(ReflectionField);
            expect(fields[2].name).toBe('length');

            expect(fields[3]).toBeInstanceOf(ReflectionField);
            expect(fields[3].name).toBe('secret');
        });
    });

    describe('.getters', () =>
    {
        it('should filter getter members', () =>
        {
            const getters = reflectionClass.getters;
            expect(getters.length).toBe(2);

            expect(getters[0]).toBeInstanceOf(ReflectionGetter);
            expect(getters[0].name).toBe('name');

            expect(getters[1]).toBeInstanceOf(ReflectionGetter);
            expect(getters[1].name).toBe('age');
        });
    });

    describe('.setters', () =>
    {
        it('should filter setter members', () =>
        {
            const setters = reflectionClass.setters;
            expect(setters.length).toBe(1);

            expect(setters[0]).toBeInstanceOf(ReflectionSetter);
            expect(setters[0].name).toBe('age');
        });
    });

    describe('.functions', () =>
    {
        it('should filter function members', () =>
        {
            const functions = reflectionClass.functions;
            expect(functions.length).toBe(3);

            expect(functions[0]).toBeInstanceOf(ReflectionFunction);
            expect(functions[0].name).toBe('constructor');

            expect(functions[1]).toBeInstanceOf(ReflectionFunction);
            expect(functions[1].name).toBe('secretStuff');

            expect(functions[2]).toBeInstanceOf(ReflectionFunction);
            expect(functions[2].name).toBe('toString');
        });
    });

    describe('.canRead(name)', () =>
    {
        it('should read a public field', () =>
        {
            const canRead = reflectionClass.canRead('length');

            expect(canRead).toBe(true);
        });

        it('should read a private field with getter', () =>
        {
            const canRead = reflectionClass.canRead('name');

            expect(canRead).toBe(true);
        });

        it('should not read a private field without a getter', () =>
        {
            const canRead = reflectionClass.canRead('secret');

            expect(canRead).toBe(false);
        });
    });

    describe('.canWrite(name)', () =>
    {
        it('should write a public field', () =>
        {
            const canWrite = reflectionClass.canWrite('length');

            expect(canWrite).toBe(true);
        });

        it('should write a private field with setter', () =>
        {
            const canWrite = reflectionClass.canWrite('age');

            expect(canWrite).toBe(true);
        });

        it('should not wite a private field without a setter', () =>
        {
            const canWrite = reflectionClass.canWrite('secret');

            expect(canWrite).toBe(false);
        });
    });

    describe('.canCall(name)', () =>
    {
        it('should call a public function', () =>
        {
            const canCall = reflectionClass.canCall('toString');

            expect(canCall).toBe(true);
        });

        it('should not call a private function', () =>
        {
            const canCall = reflectionClass.canCall('secretStuff');

            expect(canCall).toBe(false);
        });
    });
});
