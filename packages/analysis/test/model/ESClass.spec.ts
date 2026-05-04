
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
            expect(declarations).toHaveLength(4);

            expect(declarations[0]).toBeInstanceOf(ESField);
            expect(declarations[0].identifier).toEqual('name');

            expect(declarations[1]).toBeInstanceOf(ESField);
            expect(declarations[1].identifier).toEqual('age');

            expect(declarations[2]).toBeInstanceOf(ESField);
            expect(declarations[2].identifier).toEqual('length');

            expect(declarations[3]).toBeInstanceOf(ESField);
            expect(declarations[3].identifier).toEqual('secret');
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
            expect(getters).toHaveLength(2);

            expect(getters[0]).toBeInstanceOf(ESGetter);
            expect(getters[0].identifier).toEqual('name');

            expect(getters[1]).toBeInstanceOf(ESGetter);
            expect(getters[1].identifier).toEqual('age');
        });
    });

    describe('.setters', () =>
    {
        it('should filter setter members', () =>
        {
            const setters = esClass.setters;
            expect(setters).toHaveLength(1);

            expect(setters[0]).toBeInstanceOf(ESSetter);
            expect(setters[0].identifier).toEqual('age');
        });
    });

    describe('.methods', () =>
    {
        it('should filter method members', () =>
        {
            const methods = esClass.methods;
            expect(methods).toHaveLength(3);

            expect(methods[0]).toBeInstanceOf(ESMethod);
            expect(methods[0].identifier).toEqual('secretStuff');

            expect(methods[1]).toBeInstanceOf(ESMethod);
            expect(methods[1].identifier).toEqual('toString');

            expect(methods[2]).toBeInstanceOf(ESGeneratorMethod);
            expect(methods[2].identifier).toEqual('createJohn');
        });
    });

    describe('.readable', () =>
    {
        it('should return all readable members', () =>
        {
            const readable = esClass.readable;
            expect(readable).toHaveLength(3);

            expect(readable[0].identifier).toEqual('length');
            expect(readable[0]).toBeInstanceOf(ESField);

            expect(readable[1].identifier).toEqual('name');
            expect(readable[1]).toBeInstanceOf(ESGetter);

            expect(readable[2].identifier).toEqual('age');
            expect(readable[2]).toBeInstanceOf(ESGetter);
        });
    });

    describe('.writable', () =>
    {
        it('should return all writable members', () =>
        {
            const writable = esClass.writable;
            expect(writable).toHaveLength(2);

            expect(writable[0].identifier).toEqual('length');
            expect(writable[0]).toBeInstanceOf(ESField);

            expect(writable[1].identifier).toEqual('age');
            expect(writable[1]).toBeInstanceOf(ESSetter);
        });
    });

    describe('.getMember(identifier)', () =>
    {
        it('should get a member by its identifier', () =>
        {
            const member = esClass.getMember('toString');
            expect(member).toBeInstanceOf(ESMethod);
            expect(member?.identifier).toEqual('toString');
        });
    });

    describe('.getField(identifier)', () =>
    {
        it('should get a field by its identifier', () =>
        {
            const member = esClass.getField('name');
            expect(member).toBeInstanceOf(ESField);
            expect(member?.identifier).toEqual('name');
        });
    });

    describe('.getGetter(identifier)', () =>
    {
        it('should get a getter by its identifier', () =>
        {
            const member = esClass.getGetter('name');
            expect(member).toBeInstanceOf(ESGetter);
            expect(member?.identifier).toEqual('name');
        });
    });

    describe('.getSetter(identifier)', () =>
    {
        it('should get a setter by its identifier', () =>
        {
            const member = esClass.getSetter('age');
            expect(member).toBeInstanceOf(ESSetter);
            expect(member?.identifier).toEqual('age');
        });
    });

    describe('.getMethod(identifier)', () =>
    {
        it('should get a method by its identifier', () =>
        {
            const member = esClass.getMethod('secretStuff');
            expect(member).toBeInstanceOf(ESMethod);
            expect(member?.identifier).toEqual('secretStuff');
        });
    });

    describe('.hasMember(identifier)', () =>
    {
        it('should have an existing member', () =>
        {
            const result = esClass.hasMember('age');
            expect(result).toBeTruthy();
        });

        it('should not have a non-existing member', () =>
        {
            const result = esClass.hasMember('nonExisting');
            expect(result).toBeFalsy();
        });
    });

    describe('.hasField(identifier)', () =>
    {
        it('should have an existing field', () =>
        {
            const result = esClass.hasField('name');
            expect(result).toBeTruthy();
        });

        it('should not have a non-existing field', () =>
        {
            const result = esClass.hasField('createJohn');
            expect(result).toBeFalsy();
        });
    });

    describe('.hasGetter(identifier)', () =>
    {
        it('should have an existing getter', () =>
        {
            const result = esClass.hasGetter('name');
            expect(result).toBeTruthy();
        });

        it('should not have a non-existing getter', () =>
        {
            const result = esClass.hasGetter('createJohn');
            expect(result).toBeFalsy();
        });
    });

    describe('.hasSetter(identifier)', () =>
    {
        it('should have an existing setter', () =>
        {
            const result = esClass.hasSetter('age');
            expect(result).toBeTruthy();
        });

        it('should not have a non-existing setter', () =>
        {
            const result = esClass.hasSetter('name');
            expect(result).toBeFalsy();
        });
    });

    describe('.hasMethod(identifier)', () =>
    {
        it('should have an existing function', () =>
        {
            const result = esClass.hasMethod('secretStuff');
            expect(result).toBeTruthy();
        });

        it('should not have a non-existing function', () =>
        {
            const result = esClass.hasMethod('name');
            expect(result).toBeFalsy();
        });
    });

    describe('.canRead(identifier)', () =>
    {
        it('should read a public field', () =>
        {
            const canRead = esClass.canRead('length');
            expect(canRead).toBeTruthy();
        });

        it('should read a private field with getter', () =>
        {
            const canRead = esClass.canRead('name');
            expect(canRead).toBeTruthy();
        });

        it('should not read a private field without a getter', () =>
        {
            const canRead = esClass.canRead('secret');
            expect(canRead).toBeFalsy();
        });
    });

    describe('.canWrite(identifier)', () =>
    {
        it('should write a public field', () =>
        {
            const canWrite = esClass.canWrite('length');
            expect(canWrite).toBeTruthy();
        });

        it('should write a private field with setter', () =>
        {
            const canWrite = esClass.canWrite('age');
            expect(canWrite).toBeTruthy();
        });

        it('should not wite a private field without a setter', () =>
        {
            const canWrite = esClass.canWrite('secret');
            expect(canWrite).toBeFalsy();
        });
    });
});
