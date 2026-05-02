
import { describe, expect, it } from 'vitest';

import { ESField, ESConstructor, ESMethod, ESGeneratorMethod, ESGetter, ESSetter } from '../../src/model';

import { esClass } from './fixtures';

describe('model/ESClass', () =>
{
    describe('.fields', () =>
    {
        it('should filter field members', () =>
        {
            const declarations = esClass.fields;
            expect(declarations.length).toBe(4);

            expect(declarations[0]).toBeInstanceOf(ESField);
            expect(declarations[0].identifier).toBe('name');

            expect(declarations[1]).toBeInstanceOf(ESField);
            expect(declarations[1].identifier).toBe('age');

            expect(declarations[1]).toBeInstanceOf(ESField);
            expect(declarations[1].identifier).toBe('length');

            expect(declarations[1]).toBeInstanceOf(ESField);
            expect(declarations[1].identifier).toBe('secret');
        });
    });

    describe('.construct', () =>
    {
        it('should filter the constructor member', () =>
        {
            const construct = esClass.construct;
            expect(construct).toBeInstanceOf(ESConstructor);
            expect(construct?.parameters).toHaveLength(1);
        });
    });

    describe('.getters', () =>
    {
        it('should filter getter members', () =>
        {
            const getters = esClass.getters;
            expect(getters.length).toBe(2);

            expect(getters[0]).toBeInstanceOf(ESGetter);
            expect(getters[0].identifier).toBe('name');

            expect(getters[1]).toBeInstanceOf(ESGetter);
            expect(getters[1].identifier).toBe('age');
        });
    });

    describe('.setters', () =>
    {
        it('should filter setter members', () =>
        {
            const setters = esClass.setters;
            expect(setters.length).toBe(1);

            expect(setters[0]).toBeInstanceOf(ESSetter);
            expect(setters[0].identifier).toBe('age');
        });
    });

    describe('.methods', () =>
    {
        it('should filter function members', () =>
        {
            const functions = esClass.methods;
            expect(functions.length).toBe(2);

            expect(functions[0]).toBeInstanceOf(ESMethod);
            expect(functions[0].identifier).toBe('createJohn');

            expect(functions[1]).toBeInstanceOf(ESMethod);
            expect(functions[1].identifier).toBe('sum');
        });
    });

    describe('.generators', () =>
    {
        it('should filter generator members', () =>
        {
            const generators = esClass.generators;
            expect(generators.length).toBe(1);

            expect(generators[0]).toBeInstanceOf(ESGeneratorMethod);
            expect(generators[0].identifier).toBe('createJohn');
        });
    });

    // describe('.readable', () =>
    // {
    //     it('should return all readable members', () =>
    //     {
    //         const readable = esClass.readable;
    //         expect(readable.length).toBe(3);

    //         expect(readable[0].name).toBe('name');
    //         expect(readable[0]).toBeInstanceOf(ESGetter);

    //         expect(readable[1].name).toBe('age');
    //         expect(readable[1]).toBeInstanceOf(ESGetter);

    //         expect(readable[2].name).toBe('length');
    //         expect(readable[2]).toBeInstanceOf(ESDeclaration);
    //     });
    // });

    // describe('.writable', () =>
    // {
    //     it('should return all writable members', () =>
    //     {
    //         const writable = esClass.writable;
    //         expect(writable.length).toBe(2);

    //         expect(writable[0].name).toBe('age');
    //         expect(writable[0]).toBeInstanceOf(ESSetter);

    //         expect(writable[1].name).toBe('length');
    //         expect(writable[1]).toBeInstanceOf(ESDeclaration);
    //     });
    // });

    // describe('.callable', () =>
    // {
    //     it('should return all callable members', () =>
    //     {
    //         const callable = esClass.callable;
    //         expect(callable.length).toBe(2);

    //         expect(callable[0].name).toBe('constructor');
    //         expect(callable[0]).toBeInstanceOf(ESFunction);

    //         expect(callable[1].name).toBe('toString');
    //         expect(callable[1]).toBeInstanceOf(ESFunction);
    //     });
    // });

    // describe('.getMember(name)', () =>
    // {
    //     it('should get a member by its identifier', () =>
    //     {
    //         const member = esClass.getMember('sum');
    //         expect(member).toBeInstanceOf(ESMethod);
    //         expect(member?.name).toBe('sum');
    //     });
    // });

    // describe('.getMethod(name)', () =>
    // {
    //     it('should get a function by its name', () =>
    //     {
    //         const member = esClass.getMethod('secretStuff');
    //         expect(member).toBeInstanceOf(ESGeneratorMethod);
    //         expect(member?.name).toBe('secretStuff');
    //     });
    // });

    // describe('.getGetter(name)', () =>
    // {
    //     it('should get a getter by its name', () =>
    //     {
    //         const member = esClass.getGetter('name');
    //         expect(member).toBeInstanceOf(ESGetter);
    //         expect(member?.name).toBe('name');
    //     });
    // });

    // describe('.getSetter(name)', () =>
    // {
    //     it('should get a setter by its name', () =>
    //     {
    //         const member = esClass.getSetter('age');
    //         expect(member).toBeInstanceOf(ESSetter);
    //         expect(member?.name).toBe('age');
    //     });
    // });

    // describe('.getGenerator(name)', () =>
    // {
    //     it('should get a generator by its name', () =>
    //     {
    //         const member = esClass.getGenerator('createJohn');
    //         expect(member).toBeInstanceOf(ESGeneratorMethod);
    //         expect(member?.name).toBe('createJohn');
    //     });
    // });

    // describe('.hasMember(name)', () =>
    // {
    //     it('should have an existing member', () =>
    //     {
    //         const result = esClass.hasMember('age');
    //         expect(result).toBe(true);
    //     });

    //     it('should not have a non-existing member', () =>
    //     {
    //         const result = esClass.hasMember('nonExisting');
    //         expect(result).toBe(false);
    //     });
    // });

    // describe('.hasMethod(name)', () =>
    // {
    //     it('should have an existing function', () =>
    //     {
    //         const result = esClass.hasMethod('secretStuff');
    //         expect(result).toBe(true);
    //     });

    //     it('should not have a non-existing function', () =>
    //     {
    //         const result = esClass.hasMethod('name');
    //         expect(result).toBe(false);
    //     });
    // });

    // describe('.hasGetter(name)', () =>
    // {
    //     it('should have an existing getter', () =>
    //     {
    //         const result = esClass.hasGetter('name');
    //         expect(result).toBe(true);
    //     });

    //     it('should not have a non-existing getter', () =>
    //     {
    //         const result = esClass.hasGetter('createJohn');
    //         expect(result).toBe(false);
    //     });
    // });

    // describe('.hasSetter(name)', () =>
    // {
    //     it('should have an existing setter', () =>
    //     {
    //         const result = esClass.hasSetter('age');
    //         expect(result).toBe(true);
    //     });

    //     it('should not have a non-existing setter', () =>
    //     {
    //         const result = esClass.hasSetter('name');
    //         expect(result).toBe(false);
    //     });
    // });

    // describe('.hasGenerator(name)', () =>
    // {
    //     it('should have an existing generator', () =>
    //     {
    //         const result = esClass.hasGenerator('createJohn');
    //         expect(result).toBe(true);
    //     });

    //     it('should not have a non-existing generator', () =>
    //     {
    //         const result = esClass.hasGenerator('sum');
    //         expect(result).toBe(false);
    //     });
    // });

    // describe('.canRead(name)', () =>
    // {
    //     it('should read a public field', () =>
    //     {
    //         const canRead = esClass.canRead('length');

    //         expect(canRead).toBe(true);
    //     });

    //     it('should read a private field with getter', () =>
    //     {
    //         const canRead = esClass.canRead('name');

    //         expect(canRead).toBe(true);
    //     });

    //     it('should not read a private field without a getter', () =>
    //     {
    //         const canRead = esClass.canRead('secret');

    //         expect(canRead).toBe(false);
    //     });
    // });

    // describe('.canWrite(name)', () =>
    // {
    //     it('should write a public field', () =>
    //     {
    //         const canWrite = esClass.canWrite('length');

    //         expect(canWrite).toBe(true);
    //     });

    //     it('should write a private field with setter', () =>
    //     {
    //         const canWrite = esClass.canWrite('age');

    //         expect(canWrite).toBe(true);
    //     });

    //     it('should not wite a private field without a setter', () =>
    //     {
    //         const canWrite = esClass.canWrite('secret');

    //         expect(canWrite).toBe(false);
    //     });
    // });

    // describe('.canCall(name)', () =>
    // {
    //     it('should call a public function', () =>
    //     {
    //         const canCall = esClass.canCall('toString');

    //         expect(canCall).toBe(true);
    //     });

    //     it('should not call a private function', () =>
    //     {
    //         const canCall = esClass.canCall('secretStuff');

    //         expect(canCall).toBe(false);
    //     });
    // });
});
