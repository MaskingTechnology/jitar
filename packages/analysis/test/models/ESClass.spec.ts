
import { describe, expect, it } from 'vitest';

import { ESDeclaration, ESFunction, ESGetter, ESSetter } from '../../src/models';

import { esClass } from './fixtures';

describe('models/ESClass', () =>
{
    // Scope tests are omitted
    
    describe('.readable', () =>
    {
        it('should return all readable members', () =>
        {
            const readable = esClass.readable;
            expect(readable.length).toBe(3);

            expect(readable[0].name).toBe('name');
            expect(readable[0]).toBeInstanceOf(ESGetter);

            expect(readable[1].name).toBe('age');
            expect(readable[1]).toBeInstanceOf(ESGetter);

            expect(readable[2].name).toBe('length');
            expect(readable[2]).toBeInstanceOf(ESDeclaration);
        });
    });

    describe('.writable', () =>
    {
        it('should return all writable members', () =>
        {
            const writable = esClass.writable;
            expect(writable.length).toBe(2);

            expect(writable[0].name).toBe('age');
            expect(writable[0]).toBeInstanceOf(ESSetter);

            expect(writable[1].name).toBe('length');
            expect(writable[1]).toBeInstanceOf(ESDeclaration);
        });
    });

    describe('.callable', () =>
    {
        it('should return all callable members', () =>
        {
            const callable = esClass.callable;
            expect(callable.length).toBe(2);

            expect(callable[0].name).toBe('constructor');
            expect(callable[0]).toBeInstanceOf(ESFunction);

            expect(callable[1].name).toBe('toString');
            expect(callable[1]).toBeInstanceOf(ESFunction);
        });
    });

    describe('.canRead(name)', () =>
    {
        it('should read a public field', () =>
        {
            const canRead = esClass.canRead('length');

            expect(canRead).toBe(true);
        });

        it('should read a private field with getter', () =>
        {
            const canRead = esClass.canRead('name');

            expect(canRead).toBe(true);
        });

        it('should not read a private field without a getter', () =>
        {
            const canRead = esClass.canRead('secret');

            expect(canRead).toBe(false);
        });
    });

    describe('.canWrite(name)', () =>
    {
        it('should write a public field', () =>
        {
            const canWrite = esClass.canWrite('length');

            expect(canWrite).toBe(true);
        });

        it('should write a private field with setter', () =>
        {
            const canWrite = esClass.canWrite('age');

            expect(canWrite).toBe(true);
        });

        it('should not wite a private field without a setter', () =>
        {
            const canWrite = esClass.canWrite('secret');

            expect(canWrite).toBe(false);
        });
    });

    describe('.canCall(name)', () =>
    {
        it('should call a public function', () =>
        {
            const canCall = esClass.canCall('toString');

            expect(canCall).toBe(true);
        });

        it('should not call a private function', () =>
        {
            const canCall = esClass.canCall('secretStuff');

            expect(canCall).toBe(false);
        });
    });
});
