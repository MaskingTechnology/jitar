
import ReflectionField from '../../src/models/ReflectionField';
import ReflectionFunction from '../../src/models/ReflectionFunction';
import ReflectionGetter from '../../src/models/ReflectionGetter';
import ReflectionSetter from '../../src/models/ReflectionSetter';

import { reflectionClass } from '../_fixtures/models/ReflectionClass.fixture';

describe('models/ReflectionClass', () =>
{
    // Scope tests are omitted
    
    describe('.readable', () =>
    {
        it('should return all readable members', () =>
        {
            const readable = reflectionClass.readable;
            expect(readable.length).toBe(3);

            expect(readable[0].name).toBe('name');
            expect(readable[0]).toBeInstanceOf(ReflectionGetter);

            expect(readable[1].name).toBe('age');
            expect(readable[1]).toBeInstanceOf(ReflectionGetter);

            expect(readable[2].name).toBe('length');
            expect(readable[2]).toBeInstanceOf(ReflectionField);
        });
    });

    describe('.writable', () =>
    {
        it('should return all writable members', () =>
        {
            const writable = reflectionClass.writable;
            expect(writable.length).toBe(2);

            expect(writable[0].name).toBe('age');
            expect(writable[0]).toBeInstanceOf(ReflectionSetter);

            expect(writable[1].name).toBe('length');
            expect(writable[1]).toBeInstanceOf(ReflectionField);
        });
    });

    describe('.callable', () =>
    {
        it('should return all callable members', () =>
        {
            const callable = reflectionClass.callable;
            expect(callable.length).toBe(2);

            expect(callable[0].name).toBe('constructor');
            expect(callable[0]).toBeInstanceOf(ReflectionFunction);

            expect(callable[1].name).toBe('toString');
            expect(callable[1]).toBeInstanceOf(ReflectionFunction);
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
