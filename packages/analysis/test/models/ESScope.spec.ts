
import { describe, expect, it } from 'vitest';

import { ESImport, ESDeclaration, ESFunction, ESGenerator, ESClass, ESExport, ESGetter, ESSetter } from '../../src/models';

import { esScope } from './fixtures';

describe('models/ESScope', () =>
{
    describe('.imports', () =>
    {
        it('should filter import members', () =>
        {
            const imports = esScope.imports;
            expect(imports.length).toBe(1);

            expect(imports[0]).toBeInstanceOf(ESImport);
            expect(imports[0].members.length).toBe(1);
        });
    });

    describe('.exports', () =>
    {
        it('should filter export members', () =>
        {
            const exports = esScope.exports;
            expect(exports.length).toBe(1);

            expect(exports[0]).toBeInstanceOf(ESExport);
            expect(exports[0].members.length).toBe(2);
        });
    });

    describe('.fields', () =>
    {
        it('should filter field members', () =>
        {
            const declarations = esScope.declarations;
            expect(declarations.length).toBe(2);

            expect(declarations[0]).toBeInstanceOf(ESDeclaration);
            expect(declarations[0].name).toBe('name');

            expect(declarations[1]).toBeInstanceOf(ESDeclaration);
            expect(declarations[1].name).toBe('age');
        });
    });

    describe('.functions', () =>
    {
        it('should filter function members', () =>
        {
            const functions = esScope.functions;
            expect(functions.length).toBe(2);

            expect(functions[0]).toBeInstanceOf(ESFunction);
            expect(functions[0].name).toBe('createJohn');

            expect(functions[1]).toBeInstanceOf(ESFunction);
            expect(functions[1].name).toBe('sum');
        });
    });

    describe('.getters', () =>
    {
        it('should filter getter members', () =>
        {
            const getters = esScope.getters;
            expect(getters.length).toBe(2);

            expect(getters[0]).toBeInstanceOf(ESGetter);
            expect(getters[0].name).toBe('name');

            expect(getters[1]).toBeInstanceOf(ESGetter);
            expect(getters[1].name).toBe('age');
        });
    });

    describe('.setters', () =>
    {
        it('should filter setter members', () =>
        {
            const setters = esScope.setters;
            expect(setters.length).toBe(1);

            expect(setters[0]).toBeInstanceOf(ESSetter);
            expect(setters[0].name).toBe('age');
        });
    });

    describe('.generators', () =>
    {
        it('should filter generator members', () =>
        {
            const generators = esScope.generators;
            expect(generators.length).toBe(1);

            expect(generators[0]).toBeInstanceOf(ESGenerator);
            expect(generators[0].name).toBe('createJohn');
        });
    });

    describe('.classes', () =>
    {
        it('should filter class members', () =>
        {
            const classes = esScope.classes;
            expect(classes.length).toBe(1);

            expect(classes[0]).toBeInstanceOf(ESClass);
            expect(classes[0].name).toBe('Customer');
        });
    });

    describe('.getMember(name)', () =>
    {
        it('should get a member by its name', () =>
        {
            const member = esScope.getMember('sum');
            expect(member).toBeInstanceOf(ESFunction);
            expect(member?.name).toBe('sum');
        });
    });

    describe('.getDeclaration(name)', () =>
    {
        it('should get a field by its name', () =>
        {
            const member = esScope.getDeclaration('name');
            expect(member).toBeInstanceOf(ESDeclaration);
            expect(member?.name).toBe('name');
        });
    });

    describe('.getFunction(name)', () =>
    {
        it('should get a function by its name', () =>
        {
            const member = esScope.getFunction('createJohn');
            expect(member).toBeInstanceOf(ESFunction);
            expect(member?.name).toBe('createJohn');
        });
    });

    describe('.getGetter(name)', () =>
    {
        it('should get a getter by its name', () =>
        {
            const member = esScope.getGetter('name');
            expect(member).toBeInstanceOf(ESGetter);
            expect(member?.name).toBe('name');
        });
    });

    describe('.getSetter(name)', () =>
    {
        it('should get a setter by its name', () =>
        {
            const member = esScope.getSetter('age');
            expect(member).toBeInstanceOf(ESSetter);
            expect(member?.name).toBe('age');
        });
    });

    describe('.getGenerator(name)', () =>
    {
        it('should get a generator by its name', () =>
        {
            const member = esScope.getGenerator('createJohn');
            expect(member).toBeInstanceOf(ESGenerator);
            expect(member?.name).toBe('createJohn');
        });
    });

    describe('.getClass(name)', () =>
    {
        it('should get a class by its name', () =>
        {
            const member = esScope.getClass('Customer');
            expect(member).toBeInstanceOf(ESClass);
            expect(member?.name).toBe('Customer');
        });
    });

    describe('.hasMember(name)', () =>
    {
        it('should have an existing member', () =>
        {
            const result = esScope.hasMember('sum');
            expect(result).toBe(true);
        });

        it('should not have a non-existing member', () =>
        {
            const result = esScope.hasMember('nonExisting');
            expect(result).toBe(false);
        });
    });

    describe('.hasDeclaration(name)', () =>
    {
        it('should have an existing field', () =>
        {
            const result = esScope.hasDeclaration('age');
            expect(result).toBe(true);
        });

        it('should not have a non-existing field', () =>
        {
            const result = esScope.hasDeclaration('Customer');
            expect(result).toBe(false);
        });
    });

    describe('.hasFunction(name)', () =>
    {
        it('should have an existing function', () =>
        {
            const result = esScope.hasFunction('createJohn');
            expect(result).toBe(true);
        });

        it('should not have a non-existing function', () =>
        {
            const result = esScope.hasFunction('name');
            expect(result).toBe(false);
        });
    });

    describe('.hasGetter(name)', () =>
    {
        it('should have an existing getter', () =>
        {
            const result = esScope.hasGetter('name');
            expect(result).toBe(true);
        });

        it('should not have a non-existing getter', () =>
        {
            const result = esScope.hasGetter('createJohn');
            expect(result).toBe(false);
        });
    });

    describe('.hasSetter(name)', () =>
    {
        it('should have an existing setter', () =>
        {
            const result = esScope.hasSetter('age');
            expect(result).toBe(true);
        });

        it('should not have a non-existing setter', () =>
        {
            const result = esScope.hasSetter('name');
            expect(result).toBe(false);
        });
    });

    describe('.hasGenerator(name)', () =>
    {
        it('should have an existing generator', () =>
        {
            const result = esScope.hasGenerator('createJohn');
            expect(result).toBe(true);
        });

        it('should not have a non-existing generator', () =>
        {
            const result = esScope.hasGenerator('sum');
            expect(result).toBe(false);
        });
    });

    describe('.hasClass(name)', () =>
    {
        it('should have an existing class', () =>
        {
            const result = esScope.hasClass('Customer');
            expect(result).toBe(true);
        });

        it('should not have a non-existing class', () =>
        {
            const result = esScope.hasClass('name');
            expect(result).toBe(false);
        });
    });
});
