
import { describe, expect, it } from 'vitest';

import ReflectionClass from '../../src/models/ReflectionClass';
import ReflectionDeclaration from '../../src/models/ReflectionDeclaration';
import ReflectionFunction from '../../src/models/ReflectionFunction';
import ReflectionGenerator from '../../src/models/ReflectionGenerator';
import ReflectionMember from '../../src/models/ReflectionMember';

import { reflectionModule } from '../_fixtures/models/ReflectionModule.fixture';

describe('models/ReflectionModule', () =>
{
    // Scope tests are omitted

    describe('.exportedDeclarations', () =>
    {
        it('should filter exported declarations', () =>
        {
            const declarations = reflectionModule.exportedDeclarations;
            expect(declarations.length).toBe(1);

            expect(declarations[0]).toBeInstanceOf(ReflectionDeclaration);
            expect(declarations[0].name).toBe('peter');
        });
    });

    describe('.exportedFunctions', () =>
    {
        it('should filter exported functions', () =>
        {
            const functions = reflectionModule.exportedFunctions;
            expect(functions.length).toBe(1);

            expect(functions[0]).toBeInstanceOf(ReflectionFunction);
            expect(functions[0].name).toBe('sum');
        });
    });

    describe('.exportedGenerators', () =>
    {
        it('should filter exported generators', () =>
        {
            const generators = reflectionModule.exportedGenerators;
            expect(generators.length).toBe(1);

            expect(generators[0]).toBeInstanceOf(ReflectionGenerator);
            expect(generators[0].name).toBe('generateNumbers');
        });
    });

    describe('.exportedClasses', () =>
    {
        it('should filter exported classes', () =>
        {
            const classes = reflectionModule.exportedClasses;
            expect(classes.length).toBe(1);

            expect(classes[0]).toBeInstanceOf(ReflectionClass);
            expect(classes[0].name).toBe('Customer');
        });
    });

    describe('.exported', () =>
    {
        it('should return a map with exported members only', () =>
        {
            const exported = reflectionModule.exported;
            expect(exported.size).toBe(4);

            const first = exported.get('default') as ReflectionFunction;
            expect(first).toBeInstanceOf(ReflectionFunction);
            expect(first.name).toBe('sum');

            const second = exported.get('peter') as ReflectionDeclaration;
            expect(second).toBeInstanceOf(ReflectionDeclaration);
            expect(second.name).toBe('peter');

            const third = exported.get('Customer') as ReflectionClass;
            expect(third).toBeInstanceOf(ReflectionClass);
            expect(third.name).toBe('Customer');

            const fourth = exported.get('generateNumbers') as ReflectionGenerator;
            expect(fourth).toBeInstanceOf(ReflectionGenerator);
            expect(fourth.name).toBe('generateNumbers');
        });
    });

    describe('.isExported(member)', () =>
    {
        it('should indicate that a member is exported', () =>
        {
            const member = reflectionModule.getMember('sum') as ReflectionMember;
            const result = reflectionModule.isExported(member);
            expect(result).toBe(true);
        });

        it('should indicate that a member is not exported', () =>
        {
            const member = reflectionModule.getMember('createJohn') as ReflectionMember;
            const result = reflectionModule.isExported(member);
            expect(result).toBe(false);
        });
    });

    describe('.getExported(name)', () =>
    {
        it('should get an exported member', () =>
        {
            const member = reflectionModule.getExported('default') as ReflectionFunction;
            expect(member).toBeInstanceOf(ReflectionFunction);
            expect(member.name).toBe('sum');
        });

        it('should not get a non-exported member', () =>
        {
            const member = reflectionModule.getExported('createJohn');
            expect(member).toBe(undefined);
        });
    });
});
