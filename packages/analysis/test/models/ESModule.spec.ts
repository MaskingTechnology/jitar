
import { describe, expect, it } from 'vitest';

import { ESClass, ESDeclaration, ESFunction, ESGenerator, ESMember } from '../../src/models';

import { esModule } from './fixtures';

describe('models/ESModule', () =>
{
    // Scope tests are omitted

    describe('.exportedDeclarations', () =>
    {
        it('should filter exported declarations', () =>
        {
            const declarations = esModule.exportedDeclarations;
            expect(declarations.length).toBe(1);

            expect(declarations[0]).toBeInstanceOf(ESDeclaration);
            expect(declarations[0].name).toBe('peter');
        });
    });

    describe('.exportedFunctions', () =>
    {
        it('should filter exported functions', () =>
        {
            const functions = esModule.exportedFunctions;
            expect(functions.length).toBe(1);

            expect(functions[0]).toBeInstanceOf(ESFunction);
            expect(functions[0].name).toBe('sum');
        });
    });

    describe('.exportedGenerators', () =>
    {
        it('should filter exported generators', () =>
        {
            const generators = esModule.exportedGenerators;
            expect(generators.length).toBe(1);

            expect(generators[0]).toBeInstanceOf(ESGenerator);
            expect(generators[0].name).toBe('generateNumbers');
        });
    });

    describe('.exportedClasses', () =>
    {
        it('should filter exported classes', () =>
        {
            const classes = esModule.exportedClasses;
            expect(classes.length).toBe(1);

            expect(classes[0]).toBeInstanceOf(ESClass);
            expect(classes[0].name).toBe('Customer');
        });
    });

    describe('.exported', () =>
    {
        it('should return a map with exported members only', () =>
        {
            const exported = esModule.exported;
            expect(exported.size).toBe(4);

            const first = exported.get('default') as ESFunction;
            expect(first).toBeInstanceOf(ESFunction);
            expect(first.name).toBe('sum');

            const second = exported.get('peter') as ESDeclaration;
            expect(second).toBeInstanceOf(ESDeclaration);
            expect(second.name).toBe('peter');

            const third = exported.get('Customer') as ESClass;
            expect(third).toBeInstanceOf(ESClass);
            expect(third.name).toBe('Customer');

            const fourth = exported.get('generateNumbers') as ESGenerator;
            expect(fourth).toBeInstanceOf(ESGenerator);
            expect(fourth.name).toBe('generateNumbers');
        });
    });

    describe('.isExported(member)', () =>
    {
        it('should indicate that a member is exported', () =>
        {
            const member = esModule.getMember('sum') as ESMember;
            const result = esModule.isExported(member);
            expect(result).toBe(true);
        });

        it('should indicate that a member is not exported', () =>
        {
            const member = esModule.getMember('createJohn') as ESMember;
            const result = esModule.isExported(member);
            expect(result).toBe(false);
        });
    });

    describe('.getExported(name)', () =>
    {
        it('should get an exported member', () =>
        {
            const member = esModule.getExported('default') as ESFunction;
            expect(member).toBeInstanceOf(ESFunction);
            expect(member.name).toBe('sum');
        });

        it('should not get a non-exported member', () =>
        {
            const member = esModule.getExported('createJohn');
            expect(member).toBe(undefined);
        });
    });
});
