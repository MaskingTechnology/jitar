
import { describe, expect, it } from 'vitest';

import ReflectionClass from '../../src/models/ReflectionClass';
import ReflectionDeclaration from '../../src/models/ReflectionDeclaration';
import ReflectionExport from '../../src/models/ReflectionExport';
import ReflectionFunction from '../../src/models/ReflectionFunction';
import ReflectionGenerator from '../../src/models/ReflectionGenerator';
import ReflectionGetter from '../../src/models/ReflectionGetter';
import ReflectionImport from '../../src/models/ReflectionImport';
import ReflectionSetter from '../../src/models/ReflectionSetter';

import { reflectionScope } from '../_fixtures/models/ReflectionScope.fixture';

describe('models/ReflectionScope', () =>
{
    describe('.imports', () =>
    {
        it('should filter import members', () =>
        {
            const imports = reflectionScope.imports;
            expect(imports.length).toBe(1);

            expect(imports[0]).toBeInstanceOf(ReflectionImport);
            expect(imports[0].members.length).toBe(1);
        });
    });

    describe('.exports', () =>
    {
        it('should filter export members', () =>
        {
            const exports = reflectionScope.exports;
            expect(exports.length).toBe(1);

            expect(exports[0]).toBeInstanceOf(ReflectionExport);
            expect(exports[0].members.length).toBe(2);
        });
    });

    describe('.fields', () =>
    {
        it('should filter field members', () =>
        {
            const declarations = reflectionScope.declarations;
            expect(declarations.length).toBe(2);

            expect(declarations[0]).toBeInstanceOf(ReflectionDeclaration);
            expect(declarations[0].name).toBe('name');

            expect(declarations[1]).toBeInstanceOf(ReflectionDeclaration);
            expect(declarations[1].name).toBe('age');
        });
    });

    describe('.functions', () =>
    {
        it('should filter function members', () =>
        {
            const functions = reflectionScope.functions;
            expect(functions.length).toBe(2);

            expect(functions[0]).toBeInstanceOf(ReflectionFunction);
            expect(functions[0].name).toBe('createJohn');

            expect(functions[1]).toBeInstanceOf(ReflectionFunction);
            expect(functions[1].name).toBe('sum');
        });
    });

    describe('.getters', () =>
    {
        it('should filter getter members', () =>
        {
            const getters = reflectionScope.getters;
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
            const setters = reflectionScope.setters;
            expect(setters.length).toBe(1);

            expect(setters[0]).toBeInstanceOf(ReflectionSetter);
            expect(setters[0].name).toBe('age');
        });
    });

    describe('.generators', () =>
    {
        it('should filter generator members', () =>
        {
            const generators = reflectionScope.generators;
            expect(generators.length).toBe(1);

            expect(generators[0]).toBeInstanceOf(ReflectionGenerator);
            expect(generators[0].name).toBe('createJohn');
        });
    });

    describe('.classes', () =>
    {
        it('should filter class members', () =>
        {
            const classes = reflectionScope.classes;
            expect(classes.length).toBe(1);

            expect(classes[0]).toBeInstanceOf(ReflectionClass);
            expect(classes[0].name).toBe('Customer');
        });
    });

    describe('.getMember(name)', () =>
    {
        it('should get a member by its name', () =>
        {
            const member = reflectionScope.getMember('sum');
            expect(member).toBeInstanceOf(ReflectionFunction);
            expect(member?.name).toBe('sum');
        });
    });

    describe('.getDeclaration(name)', () =>
    {
        it('should get a field by its name', () =>
        {
            const member = reflectionScope.getDeclaration('name');
            expect(member).toBeInstanceOf(ReflectionDeclaration);
            expect(member?.name).toBe('name');
        });
    });

    describe('.getFunction(name)', () =>
    {
        it('should get a function by its name', () =>
        {
            const member = reflectionScope.getFunction('createJohn');
            expect(member).toBeInstanceOf(ReflectionFunction);
            expect(member?.name).toBe('createJohn');
        });
    });

    describe('.getGetter(name)', () =>
    {
        it('should get a getter by its name', () =>
        {
            const member = reflectionScope.getGetter('name');
            expect(member).toBeInstanceOf(ReflectionGetter);
            expect(member?.name).toBe('name');
        });
    });

    describe('.getSetter(name)', () =>
    {
        it('should get a setter by its name', () =>
        {
            const member = reflectionScope.getSetter('age');
            expect(member).toBeInstanceOf(ReflectionSetter);
            expect(member?.name).toBe('age');
        });
    });

    describe('.getGenerator(name)', () =>
    {
        it('should get a generator by its name', () =>
        {
            const member = reflectionScope.getGenerator('createJohn');
            expect(member).toBeInstanceOf(ReflectionGenerator);
            expect(member?.name).toBe('createJohn');
        });
    });

    describe('.getClass(name)', () =>
    {
        it('should get a class by its name', () =>
        {
            const member = reflectionScope.getClass('Customer');
            expect(member).toBeInstanceOf(ReflectionClass);
            expect(member?.name).toBe('Customer');
        });
    });

    describe('.hasMember(name)', () =>
    {
        it('should have an existing member', () =>
        {
            const result = reflectionScope.hasMember('sum');
            expect(result).toBe(true);
        });

        it('should not have a non-existing member', () =>
        {
            const result = reflectionScope.hasMember('nonExisting');
            expect(result).toBe(false);
        });
    });

    describe('.hasDeclaration(name)', () =>
    {
        it('should have an existing field', () =>
        {
            const result = reflectionScope.hasDeclaration('age');
            expect(result).toBe(true);
        });

        it('should not have a non-existing field', () =>
        {
            const result = reflectionScope.hasDeclaration('Customer');
            expect(result).toBe(false);
        });
    });

    describe('.hasFunction(name)', () =>
    {
        it('should have an existing function', () =>
        {
            const result = reflectionScope.hasFunction('createJohn');
            expect(result).toBe(true);
        });

        it('should not have a non-existing function', () =>
        {
            const result = reflectionScope.hasFunction('name');
            expect(result).toBe(false);
        });
    });

    describe('.hasGetter(name)', () =>
    {
        it('should have an existing getter', () =>
        {
            const result = reflectionScope.hasGetter('name');
            expect(result).toBe(true);
        });

        it('should not have a non-existing getter', () =>
        {
            const result = reflectionScope.hasGetter('createJohn');
            expect(result).toBe(false);
        });
    });

    describe('.hasSetter(name)', () =>
    {
        it('should have an existing setter', () =>
        {
            const result = reflectionScope.hasSetter('age');
            expect(result).toBe(true);
        });

        it('should not have a non-existing setter', () =>
        {
            const result = reflectionScope.hasSetter('name');
            expect(result).toBe(false);
        });
    });

    describe('.hasGenerator(name)', () =>
    {
        it('should have an existing generator', () =>
        {
            const result = reflectionScope.hasGenerator('createJohn');
            expect(result).toBe(true);
        });

        it('should not have a non-existing generator', () =>
        {
            const result = reflectionScope.hasGenerator('sum');
            expect(result).toBe(false);
        });
    });

    describe('.hasClass(name)', () =>
    {
        it('should have an existing class', () =>
        {
            const result = reflectionScope.hasClass('Customer');
            expect(result).toBe(true);
        });

        it('should not have a non-existing class', () =>
        {
            const result = reflectionScope.hasClass('name');
            expect(result).toBe(false);
        });
    });
});
