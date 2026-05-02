
import { describe, expect, it } from 'vitest';

import { ESImport, ESExport, ESClass, ESDeclaration, ESFunction, ESGeneratorFunction, ESVariable } from '../../src/model';

import { esModule } from './fixtures';

describe('model/ESModule', () =>
{
    describe('.imports', () =>
    {
        it('should filter import members', () =>
        {
            const imports = esModule.imports;
            expect(imports.length).toBe(1);

            expect(imports[0]).toBeInstanceOf(ESImport);
            expect(imports[0].members.length).toBe(1);
        });
    });

    describe('.exports', () =>
    {
        it('should filter export members', () =>
        {
            const exports = esModule.exports;
            expect(exports.length).toBe(1);

            expect(exports[0]).toBeInstanceOf(ESExport);
            expect(exports[0].members.length).toBe(2);
        });
    });

    describe('.variables', () =>
    {
        it('should filter field members', () =>
        {
            const declarations = esModule.variables;
            expect(declarations.length).toBe(2);

            expect(declarations[0]).toBeInstanceOf(ESVariable);
            expect(declarations[0].identifier).toBe('name');

            expect(declarations[1]).toBeInstanceOf(ESVariable);
            expect(declarations[1].identifier).toBe('age');
        });
    });

    describe('.functions', () =>
    {
        it('should filter function members', () =>
        {
            const functions = esModule.functions;
            expect(functions.length).toBe(2);

            expect(functions[0]).toBeInstanceOf(ESFunction);
            expect(functions[0].identifier).toBe('createJohn');

            expect(functions[1]).toBeInstanceOf(ESFunction);
            expect(functions[1].identifier).toBe('sum');
        });
    });

    describe('.generators', () =>
    {
        it('should filter generator members', () =>
        {
            const generators = esModule.generators;
            expect(generators.length).toBe(1);

            expect(generators[0]).toBeInstanceOf(ESGeneratorFunction);
            expect(generators[0].identifier).toBe('generateNumbers');
        });
    });

    describe('.classes', () =>
    {
        it('should filter class members', () =>
        {
            const classes = esModule.classes;
            expect(classes.length).toBe(2);

            expect(classes[0]).toBeInstanceOf(ESClass);
            expect(classes[0].identifier).toBe('Customer');

            expect(classes[1]).toBeInstanceOf(ESClass);
            expect(classes[1].identifier).toBe('Order');
        });
    });

    // describe('.getMember(name)', () =>
    // {
    //     it('should get a member by its name', () =>
    //     {
    //         const member = esModule.getMember('sum');
    //         expect(member).toBeInstanceOf(ESFunction);
    //         expect(member?.name).toBe('sum');
    //     });
    // });

    // describe('.getDeclaration(name)', () =>
    // {
    //     it('should get a field by its name', () =>
    //     {
    //         const member = esModule.getDeclaration('name');
    //         expect(member).toBeInstanceOf(ESDeclaration);
    //         expect(member?.name).toBe('name');
    //     });
    // });

    // describe('.getFunction(name)', () =>
    // {
    //     it('should get a function by its name', () =>
    //     {
    //         const member = esModule.getFunction('createJohn');
    //         expect(member).toBeInstanceOf(ESFunction);
    //         expect(member?.name).toBe('createJohn');
    //     });
    // });

    // describe('.getGenerator(name)', () =>
    // {
    //     it('should get a generator by its name', () =>
    //     {
    //         const member = esModule.getGenerator('createJohn');
    //         expect(member).toBeInstanceOf(ESGenerator);
    //         expect(member?.name).toBe('createJohn');
    //     });
    // });

    // describe('.getClass(name)', () =>
    // {
    //     it('should get a class by its name', () =>
    //     {
    //         const member = esModule.getClass('Customer');
    //         expect(member).toBeInstanceOf(ESClass);
    //         expect(member?.name).toBe('Customer');
    //     });
    // });

    // describe('.hasMember(name)', () =>
    // {
    //     it('should have an existing member', () =>
    //     {
    //         const result = esModule.hasMember('sum');
    //         expect(result).toBe(true);
    //     });

    //     it('should not have a non-existing member', () =>
    //     {
    //         const result = esModule.hasMember('nonExisting');
    //         expect(result).toBe(false);
    //     });
    // });

    // describe('.hasDeclaration(name)', () =>
    // {
    //     it('should have an existing field', () =>
    //     {
    //         const result = esModule.hasDeclaration('age');
    //         expect(result).toBe(true);
    //     });

    //     it('should not have a non-existing field', () =>
    //     {
    //         const result = esModule.hasDeclaration('Customer');
    //         expect(result).toBe(false);
    //     });
    // });

    // describe('.hasFunction(name)', () =>
    // {
    //     it('should have an existing function', () =>
    //     {
    //         const result = esModule.hasFunction('createJohn');
    //         expect(result).toBe(true);
    //     });

    //     it('should not have a non-existing function', () =>
    //     {
    //         const result = esModule.hasFunction('name');
    //         expect(result).toBe(false);
    //     });
    // });
    
    // describe('.hasGenerator(name)', () =>
    // {
    //     it('should have an existing generator', () =>
    //     {
    //         const result = esModule.hasGenerator('createJohn');
    //         expect(result).toBe(true);
    //     });

    //     it('should not have a non-existing generator', () =>
    //     {
    //         const result = esModule.hasGenerator('sum');
    //         expect(result).toBe(false);
    //     });
    // });

    // describe('.hasClass(name)', () =>
    // {
    //     it('should have an existing class', () =>
    //     {
    //         const result = esModule.hasClass('Customer');
    //         expect(result).toBe(true);
    //     });

    //     it('should not have a non-existing class', () =>
    //     {
    //         const result = esModule.hasClass('name');
    //         expect(result).toBe(false);
    //     });
    // });

    // describe('.exportedDeclarations', () =>
    // {
    //     it('should filter exported declarations', () =>
    //     {
    //         const declarations = esModule.exportedDeclarations;
    //         expect(declarations.length).toBe(1);

    //         expect(declarations[0]).toBeInstanceOf(ESDeclaration);
    //         expect(declarations[0].name).toBe('peter');
    //     });
    // });

    // describe('.exportedFunctions', () =>
    // {
    //     it('should filter exported functions', () =>
    //     {
    //         const functions = esModule.exportedFunctions;
    //         expect(functions.length).toBe(1);

    //         expect(functions[0]).toBeInstanceOf(ESFunction);
    //         expect(functions[0].name).toBe('sum');
    //     });
    // });

    // describe('.exportedGenerators', () =>
    // {
    //     it('should filter exported generators', () =>
    //     {
    //         const generators = esModule.exportedGenerators;
    //         expect(generators.length).toBe(1);

    //         expect(generators[0]).toBeInstanceOf(ESGenerator);
    //         expect(generators[0].name).toBe('generateNumbers');
    //     });
    // });

    // describe('.exportedClasses', () =>
    // {
    //     it('should filter exported classes', () =>
    //     {
    //         const classes = esModule.exportedClasses;
    //         expect(classes.length).toBe(1);

    //         expect(classes[0]).toBeInstanceOf(ESClass);
    //         expect(classes[0].name).toBe('Customer');
    //     });
    // });

    // describe('.exported', () =>
    // {
    //     it('should return a map with exported members only', () =>
    //     {
    //         const exported = esModule.exported;
    //         expect(exported.size).toBe(4);

    //         const first = exported.get('default') as ESFunction;
    //         expect(first).toBeInstanceOf(ESFunction);
    //         expect(first.name).toBe('sum');

    //         const second = exported.get('peter') as ESDeclaration;
    //         expect(second).toBeInstanceOf(ESDeclaration);
    //         expect(second.name).toBe('peter');

    //         const third = exported.get('Customer') as ESClass;
    //         expect(third).toBeInstanceOf(ESClass);
    //         expect(third.name).toBe('Customer');

    //         const fourth = exported.get('generateNumbers') as ESGenerator;
    //         expect(fourth).toBeInstanceOf(ESGenerator);
    //         expect(fourth.name).toBe('generateNumbers');
    //     });
    // });

    // describe('.isExported(member)', () =>
    // {
    //     it('should indicate that a member is exported', () =>
    //     {
    //         const member = esModule.getMember('sum') as ESMember;
    //         const result = esModule.isExported(member);
    //         expect(result).toBe(true);
    //     });

    //     it('should indicate that a member is not exported', () =>
    //     {
    //         const member = esModule.getMember('createJohn') as ESMember;
    //         const result = esModule.isExported(member);
    //         expect(result).toBe(false);
    //     });
    // });

    // describe('.getExported(name)', () =>
    // {
    //     it('should get an exported member', () =>
    //     {
    //         const member = esModule.getExported('default') as ESFunction;
    //         expect(member).toBeInstanceOf(ESFunction);
    //         expect(member.name).toBe('sum');
    //     });

    //     it('should not get a non-exported member', () =>
    //     {
    //         const member = esModule.getExported('createJohn');
    //         expect(member).toBe(undefined);
    //     });
    // });
});
