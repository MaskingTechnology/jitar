
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
            expect(imports).toHaveLength(1);

            expect(imports[0]).toBeInstanceOf(ESImport);
            expect(imports[0].members.length).toBe(1);
        });
    });

    describe('.exports', () =>
    {
        it('should filter export members', () =>
        {
            const exports = esModule.exports;
            expect(exports).toHaveLength(1);

            expect(exports[0]).toBeInstanceOf(ESExport);
            expect(exports[0].members.length).toBe(4);
        });
    });

    describe('.variables', () =>
    {
        it('should filter variable members', () =>
        {
            const declarations = esModule.variables;
            expect(declarations).toHaveLength(2);

            expect(declarations[0]).toBeInstanceOf(ESVariable);
            expect(declarations[0].identifier).toEqual('peter');

            expect(declarations[1]).toBeInstanceOf(ESVariable);
            expect(declarations[1].identifier).toEqual('bas');
        });
    });

    describe('.functions', () =>
    {
        it('should filter function members', () =>
        {
            const functions = esModule.functions;
            expect(functions).toHaveLength(3);

            expect(functions[0]).toBeInstanceOf(ESFunction);
            expect(functions[0].identifier).toEqual('createJohn');

            expect(functions[1]).toBeInstanceOf(ESFunction);
            expect(functions[1].identifier).toEqual('sum');

            expect(functions[2]).toBeInstanceOf(ESGeneratorFunction);
            expect(functions[2].identifier).toEqual('generateNumbers');
        });
    });

    describe('.classes', () =>
    {
        it('should filter class members', () =>
        {
            const classes = esModule.classes;
            expect(classes).toHaveLength(2);

            expect(classes[0]).toBeInstanceOf(ESClass);
            expect(classes[0].identifier).toEqual('Customer');

            expect(classes[1]).toBeInstanceOf(ESClass);
            expect(classes[1].identifier).toEqual('Order');
        });
    });

    describe('.getDeclaration(identifier)', () =>
    {
        it('should get a declaration by its identifier', () =>
        {
            const member = esModule.getDeclaration('sum');
            expect(member).toBeInstanceOf(ESFunction);
            expect(member?.identifier).toEqual('sum');
        });
    });

    describe('.getVariable(identifier)', () =>
    {
        it('should get a variable by its identifier', () =>
        {
            const member = esModule.getVariable('bas');
            expect(member).toBeInstanceOf(ESVariable);
            expect(member?.identifier).toEqual('bas');
        });
    });

    describe('.getFunction(identifier)', () =>
    {
        it('should get a function by its identifier', () =>
        {
            const member = esModule.getFunction('createJohn');
            expect(member).toBeInstanceOf(ESFunction);
            expect(member?.identifier).toEqual('createJohn');
        });

        it('should get a generator function by its identifier', () =>
        {
            const member = esModule.getFunction('generateNumbers');
            expect(member).toBeInstanceOf(ESGeneratorFunction);
            expect(member?.identifier).toEqual('generateNumbers');
        });
    });

    describe('.getClass(identifier)', () =>
    {
        it('should get a class by its identifier', () =>
        {
            const member = esModule.getClass('Customer');
            expect(member).toBeInstanceOf(ESClass);
            expect(member?.identifier).toEqual('Customer');
        });
    });

    describe('.hasDeclaration(identifier)', () =>
    {
        it('should have an existing member', () =>
        {
            const result = esModule.hasDeclaration('sum');
            expect(result).toBeTruthy();
        });

        it('should not have a non-existing member', () =>
        {
            const result = esModule.hasDeclaration('nonExisting');
            expect(result).toBeFalsy();
        });
    });

    describe('.hasVariable(identifier)', () =>
    {
        it('should have an existing variable', () =>
        {
            const result = esModule.hasVariable('peter');
            expect(result).toBeTruthy();
        });

        it('should not have a non-existing variable', () =>
        {
            const result = esModule.hasVariable('Customer');
            expect(result).toBeFalsy();
        });
    });

    describe('.hasFunction(identifier)', () =>
    {
        it('should have an existing function', () =>
        {
            const result = esModule.hasFunction('createJohn');
            expect(result).toBeTruthy();
        });

        it('should not have a non-existing function', () =>
        {
            const result = esModule.hasFunction('bas');
            expect(result).toBeFalsy();
        });
    });

    describe('.hasClass(identifier)', () =>
    {
        it('should have an existing class', () =>
        {
            const result = esModule.hasClass('Customer');
            expect(result).toBe(true);
        });

        it('should not have a non-existing class', () =>
        {
            const result = esModule.hasClass('peter');
            expect(result).toBe(false);
        });
    });

    describe('.exportedVariables', () =>
    {
        it('should filter exported variables', () =>
        {
            const declarations = esModule.exportedVariables;
            expect(declarations).toHaveLength(1);

            expect(declarations[0]).toBeInstanceOf(ESVariable);
            expect(declarations[0].identifier).toEqual('peter');
        });
    });

    describe('.exportedFunctions', () =>
    {
        it('should filter exported functions', () =>
        {
            const functions = esModule.exportedFunctions;
            expect(functions).toHaveLength(2);

            expect(functions[0]).toBeInstanceOf(ESFunction);
            expect(functions[0].identifier).toEqual('sum');

            expect(functions[1]).toBeInstanceOf(ESGeneratorFunction);
            expect(functions[1].identifier).toEqual('generateNumbers');
        });
    });

    describe('.exportedClasses', () =>
    {
        it('should filter exported classes', () =>
        {
            const classes = esModule.exportedClasses;
            expect(classes).toHaveLength(1);

            expect(classes[0]).toBeInstanceOf(ESClass);
            expect(classes[0].identifier).toEqual('Customer');
        });
    });
});
