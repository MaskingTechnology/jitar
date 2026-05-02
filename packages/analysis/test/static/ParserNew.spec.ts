
import { describe, expect, it } from 'vitest';

import {
    ESBinding, ESIdentifierBinding, ESArrayBinding, ESObjectBinding, ESBindingElement,
    ESBlock, ESExpression, ESVariable,
    ESFunction, ESArrowFunction, ESGeneratorFunction, ESParameter,
    ESClass, ESClassMember, ESField, ESMethod, ESGeneratorMethod, ESConstructor, ESGetter, ESSetter,
    ESModule, ESModuleMember, ESExport, ESImport, ESStatement
} from '../../src/model';

import { ParserNew as Parser } from '../../src/static';

import { VALUES, IMPORTS, EXPORTS, DECLARATIONS, FUNCTIONS, CLASSES, MODULES } from './fixtures';

const parser = new Parser();

describe('parser/Parser', () =>
{
    describe('.parseStatement(code)', () =>
    {
        it('should parse an array', () =>
        {
            const expression = parser.parseStatement(VALUES.ARRAY);
            expect(expression).toBeInstanceOf(ESExpression);
            expect(expression.toString()).toBe('[ 1 , "foo" , false , new Person ( "Peter" , 42 ) , { a : 1 , b : 2 } ]');
        });

        it('should parse an object', () =>
        {
            const expression = parser.parseStatement(VALUES.OBJECT);
            expect(expression).toBeInstanceOf(ESExpression);
            expect(expression.toString()).toBe('{ key1 : "value1" , "key2" : new Person ( ) .toString ( ) }');
        });

        it('should parse an expression', () =>
        {
            const expression = parser.parseStatement(VALUES.EXPRESSION);
            expect(expression).toBeInstanceOf(ESExpression);
            expect(expression.toString()).toBe('new Number ( Math.ceil ( Math.random ( ) ) + 10 ) .toString ( )');
        });

        it('should parse a grouped expression', () =>
        {
            const expression = parser.parseStatement(VALUES.EXPRESSION_GROUP);
            expect(expression).toBeInstanceOf(ESExpression);
            expect(expression.toString()).toBe('( a + b ) * c');
        });

        it('should parse an if...else expression', () =>
        {
            const expression = parser.parseStatement(VALUES.IF_ELSE);
            expect(expression).toBeInstanceOf(ESExpression);
            expect(expression.toString()).toBe('if ( true ) { return "value1" ; } else { return "value2" ; }');
        });

        it('should parse an try...catch...finally expression', () =>
        {
            const expression = parser.parseStatement(VALUES.TRY_CATCH_FINALLY);
            expect(expression).toBeInstanceOf(ESExpression);
            expect(expression.toString()).toBe('try { sum ( 1 , 2 ) ; } catch ( error ) { console.error ( error ) ; } finally { console.log ( "finally" ) ; }');
        });
    });

    describe('.parseImport(code)', () =>
    {
        it('should parse loading a module', () =>
        {
            const imported = parser.parseImport(IMPORTS.LOAD);
            expect(imported.members.length).toBe(0);
            expect(imported.from).toBe('module');
        });

        it('should parse importing a single member', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT);
            expect(imported.members.length).toBe(1);
            expect(imported.from).toBe('module');

            const member = imported.members[0];
            expect(member.identifier).toBe('member');
            expect(member.alias).toBeUndefined();
        });

        it('should parse importing a single member with alias', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT_AS);
            expect(imported.members.length).toBe(1);
            expect(imported.from).toBe('module');

            const member = imported.members[0];
            expect(member.identifier).toBe('member');
            expect(member.alias).toBe('alias');
        });

        it('should parse importing all members', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT_ALL);
            expect(imported.members.length).toBe(1);
            expect(imported.from).toBe('module');

            const member = imported.members[0];
            expect(member.identifier).toBe('*');
            expect(member.alias).toBe('name');
        });

        it('should parse importing the default member', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT_DEFAULT);
            expect(imported.members.length).toBe(1);
            expect(imported.from).toBe('module');

            const member = imported.members[0];
            expect(member.identifier).toBe('default');
            expect(member.alias).toBe('name');
        });

        it('should parse importing the default with another member', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT_DEFAULT_MEMBER);
            expect(imported.members.length).toBe(2);
            expect(imported.from).toBe('module');

            const first = imported.members[0];
            expect(first.identifier).toBe('default');
            expect(first.alias).toBe('name');

            const second = imported.members[1];
            expect(second.identifier).toBe('member');
            expect(second.alias).toBeUndefined();
        });

        it('should parse importing the default with another member with alias', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT_DEFAULT_MEMBER_AS);
            expect(imported.members.length).toBe(2);
            expect(imported.from).toBe('module');

            const first = imported.members[0];
            expect(first.identifier).toBe('default');
            expect(first.alias).toBe('name');

            const second = imported.members[1];
            expect(second.identifier).toBe('member');
            expect(second.alias).toBe('alias');
        });

        it('should parse importing the default with other members and aliases', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT_MULTIPLE_MEMBERS_AS);
            expect(imported.members.length).toBe(2);
            expect(imported.from).toBe('module');

            const first = imported.members[0];
            expect(first.identifier).toBe('name');
            expect(first.alias).toBeUndefined();

            const second = imported.members[1];
            expect(second.identifier).toBe('member');
            expect(second.alias).toBe('alias');
        });

        it('should parse importing modules dynamically', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT_DYNAMIC);
            expect(imported.members.length).toBe(0);
            expect(imported.from).toBe('module');
        });
    });

    describe('.parseExport(code)', () =>
    {
        it('should parse exporting a single member', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT);
            expect(exported.members.length).toBe(1);
            expect(exported.from).toBeUndefined();

            const member = exported.members[0];
            expect(member.identifier).toBe('member');
            expect(member.alias).toBeUndefined();
        });

        it('should parse exporting a single member with alias', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT_AS);
            expect(exported.members.length).toBe(1);
            expect(exported.from).toBeUndefined();

            const member = exported.members[0];
            expect(member.identifier).toBe('member');
            expect(member.alias).toBe('alias');
        });

        it('should parse exporting a default', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT_DEFAULT);
            expect(exported.members.length).toBe(1);
            expect(exported.from).toBeUndefined();

            const member = exported.members[0];
            expect(member.identifier).toBe('name');
            expect(member.alias).toBe('default');
        });

        it('should parse exporting multiple members', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT_MULTIPLE);
            expect(exported.members.length).toBe(2);
            expect(exported.from).toBeUndefined();

            const first = exported.members[0];
            expect(first.identifier).toBe('name');
            expect(first.alias).toBeUndefined();

            const second = exported.members[1];
            expect(second.identifier).toBe('member');
            expect(second.alias).toBeUndefined();
        });

        it('should parse exporting multiple members with alias', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT_MULTIPLE_AS);
            expect(exported.members.length).toBe(2);
            expect(exported.from).toBeUndefined();

            const first = exported.members[0];
            expect(first.identifier).toBe('name');
            expect(first.alias).toBeUndefined();

            const second = exported.members[1];
            expect(second.identifier).toBe('member');
            expect(second.alias).toBe('alias');
        });

        it('should parse exporting a class declaration', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT_CLASS_DECLARATION);
            expect(exported.members.length).toBe(1);
            expect(exported.from).toBeUndefined();

            const member = exported.members[0];
            expect(member.identifier).toBe('name');
            expect(member.alias).toBeUndefined();
        });

        it('should parse exporting a function declaration', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT_FUNCTION_DECLARATION);
            expect(exported.members.length).toBe(1);
            expect(exported.from).toBeUndefined();

            const member = exported.members[0];
            expect(member.identifier).toBe('name');
            expect(member.alias).toBeUndefined();
        });

        it('should parse exporting a async function declaration', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT_FIELD_DECLARATION);
            expect(exported.members.length).toBe(1);
            expect(exported.from).toBeUndefined();

            const member = exported.members[0];
            expect(member.identifier).toBe('name');
            expect(member.alias).toBeUndefined();
        });

        it('should parse reexporting a module', () =>
        {
            const exported = parser.parseExport(EXPORTS.REEXPORT_ALL);
            expect(exported.members.length).toBe(1);
            expect(exported.from).toBe('module');

            const member = exported.members[0];
            expect(member.identifier).toBe('');
            expect(member.alias).toBeUndefined();
        });

        it('should parse reexporting a member', () =>
        {
            const exported = parser.parseExport(EXPORTS.REEXPORT_MEMBER);
            expect(exported.members.length).toBe(1);
            expect(exported.from).toBe('module');

            const member = exported.members[0];
            expect(member.identifier).toBe('member');
            expect(member.alias).toBeUndefined();
        });
    });

    describe('.parseVariable(code)', () =>
    {
        it('should parse an empty declaration', () =>
        {
            const variable = parser.parseVariable(DECLARATIONS.EMPTY);

            expect(variable.identifier).toBe('name');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toBe('let');
            expect(variable.initializer).toBeUndefined();
        });

        it('should parse a const variable', () =>
        {
            const variable = parser.parseVariable(DECLARATIONS.CONST);

            expect(variable.identifier).toBe('name');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toBe('const');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString()).toEqual("'const'");
        });

        it('should parse a let declaration with value', () =>
        {
            const variable = parser.parseVariable(DECLARATIONS.LET);

            expect(variable.identifier).toBe('name');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toBe('let');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString()).toEqual("'let'");
        });

        it('should parse a var declaration with value', () =>
        {
            const variable = parser.parseVariable(DECLARATIONS.VAR);

            expect(variable.identifier).toBe('name');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toBe('var');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString()).toEqual("'var'");
        });

        it('should parse a declaration with multiple declarations', () =>
        {
            const variable = parser.parseVariable(DECLARATIONS.MULTIPLE);

            expect(variable.identifier).toBe('name1');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toBe('let');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString()).toEqual('( 1 + 2 ) * 3');
        });

        it('should parse a declaration with an expression', () =>
        {
            const variable = parser.parseVariable(DECLARATIONS.EXPRESSION);

            expect(variable.identifier).toBe('number');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toBe('const');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString()).toEqual('new Number ( Math.ceil ( Math.random ( ) ) + 10 ) .toString ( )');
        });

        it('should parse a declaration with an array value', () =>
        {
            const variable = parser.parseVariable(DECLARATIONS.ARRAY);

            expect(variable.identifier).toBe('array');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toBe('const');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString()).toEqual("[ 'value1' , 'value2' ]");
        });

        it('should parse a declaration with an array value', () =>
        {
            const variable = parser.parseVariable(DECLARATIONS.OBJECT);

            expect(variable.identifier).toBe('object');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toBe('const');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString()).toEqual("{ key1 : 'value1' , key2 : 'value2' }");
        });

        it('should parse a declaration with a regex value', () =>
        {
            const variable = parser.parseVariable(DECLARATIONS.REGEX);

            expect(variable.identifier).toBe('regex');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toBe('const');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString()).toEqual("/regex/g");
        });

        it('should parse a declaration that is destructuring an array', () =>
        {
            const variable = parser.parseVariable(DECLARATIONS.DESTRUCTURING_ARRAY);

            expect(variable.identifier).toBe('[ value1, value2 = true ]');
            expect(variable.binding).toBeInstanceOf(ESArrayBinding);
            expect(variable.type).toBe('const');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString()).toEqual('array');

            const binding = variable.binding as ESArrayBinding;
            expect(binding.elements.length).toBe(2);
            
            const firstElement = binding.elements[0] as ESBindingElement;
            expect(firstElement).toBeInstanceOf(ESBindingElement);
            expect(firstElement.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(firstElement.binding.toString()).toEqual('value1');
            expect(firstElement.initializer).toBeUndefined();

            const secondElement = binding.elements[1] as ESBindingElement;
            expect(secondElement).toBeInstanceOf(ESBindingElement);
            expect(secondElement.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(secondElement.binding.toString()).toEqual('value2');
            expect(secondElement.initializer).toBeInstanceOf(ESExpression);
            expect(secondElement.initializer?.toString()).toBe('true');
        });

        it('should parse a declaration that is destructuring an object', () =>
        {
            const variable = parser.parseVariable(DECLARATIONS.DESTRUCTURING_OBJECT);

            expect(variable.identifier).toBe('{ key1, key2 = false }');
            expect(variable.binding).toBeInstanceOf(ESObjectBinding);
            expect(variable.type).toBe('const');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString()).toEqual('object');

            const binding = variable.binding as ESObjectBinding;
            expect(binding.elements.length).toBe(2);

            const firstElement = binding.elements[0] as ESBindingElement;
            expect(firstElement.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(firstElement.binding.toString()).toEqual('key1');
            expect(firstElement.initializer).toBeUndefined();

            const secondElement = binding.elements[1] as ESBindingElement;
            expect(secondElement).toBeInstanceOf(ESBindingElement);
            expect(secondElement.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(secondElement.binding.toString()).toEqual('key2');
            expect(secondElement.initializer).toBeInstanceOf(ESExpression);
            expect(secondElement.initializer?.toString()).toBe('false');
        });

        it('should parse a declaration with a non reserved keyword as name', () =>
        {
            const variable = parser.parseVariable(DECLARATIONS.KEYWORD_AS_NAME);

            expect(variable.identifier).toBe('as');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toBe('const');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString()).toEqual("'value'");
        });

        it('should parse a declaration that refers to a non reserved keyword as value', () =>
        {
            const variable = parser.parseVariable(DECLARATIONS.KEYWORD_AS_VALUE);

            expect(variable.identifier).toBe('alias');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toBe('const');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString()).toEqual('as');
        });
    });

    describe('.parseFunction(code)', () =>
    {
        it('should parse a simple function declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.DECLARATION);

            expect(funktion.identifier).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body.toString()).toBe('{ }');
        });

        it('should parse an async function declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.ASYNC_DECLARATION);

            expect(funktion.identifier).toBe('name');
            expect(funktion.isAsync).toBe(true);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body.toString()).toBe('{ }');
        });

        it('should parse an expression function declaration', () =>
        {
            const variable = parser.parseVariable(FUNCTIONS.EXPRESSION);

            expect(variable.identifier).toEqual('name');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toEqual('const');
            expect(variable.initializer).toBeInstanceOf(ESFunction);

            const funktion = variable.initializer as ESFunction;
            
            expect(funktion.identifier).toBeUndefined();
            expect(funktion.isAsync).toBe(false);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body.toString()).toBe('{ }');
        });

        it('should parse an async expression function declaration', () =>
        {
            const variable = parser.parseVariable(FUNCTIONS.ASYNC_EXPRESSION);

            expect(variable.identifier).toEqual('name');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toEqual('const');
            expect(variable.initializer).toBeInstanceOf(ESFunction);
            
            const funktion = variable.initializer as ESFunction;

            expect(funktion.identifier).toBeUndefined();
            expect(funktion.isAsync).toBe(true);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body.toString()).toBe('{ }');
        });

        it('should parse an arrow function declaration', () =>
        {
            const variable = parser.parseVariable(FUNCTIONS.ARROW);

            expect(variable.identifier).toEqual('name');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toEqual('const');
            expect(variable.initializer).toBeInstanceOf(ESArrowFunction);
            
            const funktion = variable.initializer as ESArrowFunction;

            expect(funktion.identifier).toBeUndefined();
            expect(funktion.isAsync).toBe(false);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body.toString()).toBe('{ }');
        });

        it('should parse an arrow function expression declaration', () =>
        {
            const variable = parser.parseVariable(FUNCTIONS.ARROW_EXPRESSION);

            expect(variable.identifier).toEqual('name');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toEqual('const');
            expect(variable.initializer).toBeInstanceOf(ESArrowFunction);
            
            const funktion = variable.initializer as ESArrowFunction;

            expect(funktion.identifier).toBeUndefined();
            expect(funktion.isAsync).toBe(false);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body.toString()).toBe("'value'");
        });

        it('should parse an arrow function argument declaration', () =>
        {
            const variable = parser.parseVariable(FUNCTIONS.ARROW_ARGUMENT);

            expect(variable.identifier).toEqual('name');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toEqual('const');
            expect(variable.initializer).toBeInstanceOf(ESArrowFunction);
            
            const funktion = variable.initializer as ESArrowFunction;

            expect(funktion.identifier).toBeUndefined();
            expect(funktion.isAsync).toBe(false);
            expect(funktion.parameters.length).toBe(1);
            expect(funktion.body.toString()).toBe('arg');
        });

        it('should parse an async arrow function declaration', () =>
        {
            const variable = parser.parseVariable(FUNCTIONS.ASYNC_ARROW);

            expect(variable.identifier).toEqual('name');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toEqual('const');
            expect(variable.initializer).toBeInstanceOf(ESArrowFunction);
            
            const funktion = variable.initializer as ESArrowFunction;

            expect(funktion.identifier).toBeUndefined();
            expect(funktion.isAsync).toBe(true);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body.toString()).toBe('{ }');
        });

        it('should parse a generator function declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.GENERATOR);

            expect(funktion).toBeInstanceOf(ESGeneratorFunction);
            expect(funktion.identifier).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body.toString()).toBe('{ }');
        });

        it('should parse an async generator function declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.ASYNC_GENERATOR);

            expect(funktion).toBeInstanceOf(ESGeneratorFunction);
            expect(funktion.identifier).toBe('name');
            expect(funktion.isAsync).toBe(true);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body.toString()).toBe('{ }');
        });

        it('should parse an expression generator function declaration', () =>
        {
            const variable = parser.parseVariable(FUNCTIONS.EXPRESSION_GENERATOR);

            expect(variable.identifier).toEqual('name');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toEqual('const');
            expect(variable.initializer).toBeInstanceOf(ESGeneratorFunction);
            
            const funktion = variable.initializer as ESGeneratorFunction;

            expect(funktion.identifier).toBeUndefined();
            expect(funktion.isAsync).toBe(false);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body.toString()).toBe('{ }');
        });

        it('should parse an async expression generator function declaration', () =>
        {
            const variable = parser.parseVariable(FUNCTIONS.ASYNC_EXPRESSION_GENERATOR);

            expect(variable.identifier).toEqual('name');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toEqual('const');
            expect(variable.initializer).toBeInstanceOf(ESGeneratorFunction);
            
            const funktion = variable.initializer as ESGeneratorFunction;

            expect(funktion.identifier).toBeUndefined();
            expect(funktion.isAsync).toBe(true);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body.toString()).toBe('{ }');
        });

        it('should parse a function with parameters', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.PARAMETERS);
            expect(funktion.identifier).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.body.toString()).toBe('{ }');

            const parameters = funktion.parameters;
            expect(parameters.length).toBe(2);

            const first = parameters[0];
            expect(first.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(first.binding.toString()).toBe('param1');
            expect(first.initializer).toBeUndefined();

            const second = parameters[1];
            expect(second.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(second.binding.toString()).toBe('param2');
            expect(second.initializer).toBeUndefined();
        });

        it('should parse a function with default parameters', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.DEFAULT_PARAMETERS);
            expect(funktion.identifier).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.body.toString()).toBe('{ }');

            const parameters = funktion.parameters;
            expect(parameters.length).toBe(2);

            const first = parameters[0];
            expect(first.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(first.binding.toString()).toBe('param1');
            expect(first.initializer).toBeInstanceOf(ESExpression);
            expect(first.initializer?.toString()).toEqual("'value1'");

            const second = parameters[1];
            expect(second.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(second.binding.toString()).toBe('param2');
            expect(second.initializer).toBeInstanceOf(ESExpression);
            expect(second.initializer?.toString()).toEqual('true');
        });

        it('should parse a function with a rest parameter', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.REST_PARAMETERS);
            expect(funktion.identifier).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.body.toString()).toBe('{ }');

            const parameters = funktion.parameters;
            expect(parameters.length).toBe(1);

            const first = parameters[0];
            expect(first.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(first.binding.toString()).toEqual('...param1');
            expect(first.initializer).toBeUndefined();
        });

        it('should parse a function with destructuring parameters', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.DESTRUCTURING_PARAMETERS);
            expect(funktion.identifier).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.body.toString()).toBe('{ }');

            const parameters = funktion.parameters;
            expect(parameters.length).toBe(2);

            const firstParameter = parameters[0];
            expect(firstParameter.binding).toBeInstanceOf(ESObjectBinding);
            expect(firstParameter.initializer).toBeUndefined();

            const firstBinding = firstParameter.binding as ESObjectBinding;
            expect(firstBinding.elements).toHaveLength(2);
            expect(firstBinding.toString()).toEqual('{ param1, param2 }');

            const firstMember = firstBinding.elements[0];
            expect(firstMember.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(firstMember.binding.toString()).toEqual('param1');
            expect(firstMember.initializer).toBeUndefined();

            const secondMember = firstBinding.elements[1];
            expect(secondMember.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(secondMember.binding.toString()).toEqual('param2');
            expect(secondMember.initializer).toBeUndefined();

            const secondParameter = parameters[1];
            expect(secondParameter.binding).toBeInstanceOf(ESArrayBinding);
            expect(secondParameter.initializer).toBeUndefined();

            const secondBinding = secondParameter.binding as ESObjectBinding;
            expect(secondBinding.elements).toHaveLength(2);
            expect(secondBinding.toString()).toEqual('[ param3, param4 ]');

            const thirdMember = secondBinding.elements[0];
            expect(thirdMember.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(thirdMember.binding.toString()).toEqual('param3');
            expect(thirdMember.initializer).toBeUndefined();

            const fourthMember = secondBinding.elements[1];
            expect(fourthMember.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(fourthMember.binding.toString()).toEqual('param4');
            expect(fourthMember.initializer).toBeUndefined();
        });

        // it('should parse a function with destructuring default parameters', () =>
        // {
        //     const funktion = parser.parseFunction(FUNCTIONS.DESTRUCTURING_DEFAULT_PARAMETERS);
        //     expect(funktion.identifier).toBe('name');
        //     expect(funktion.isAsync).toBe(false);
        //     expect(funktion.body.toString()).toBe('{ }');

        //     const parameters = funktion.parameters;
        //     expect(parameters.length).toBe(2);

        //     const firstParameter = parameters[0] as ESDestructuredObject;
        //     expect(firstParameter).toBeInstanceOf(ESDestructuredObject);
        //     expect(firstParameter.members.length).toBe(2);
            
        //     const firstMember = firstParameter.members[0] as ESField;
        //     expect(firstMember).toBeInstanceOf(ESField);
        //     expect(firstMember.identifier).toBe('param1');
        //     expect(firstMember.value).toBeInstanceOf(ESExpression);

        //     const secondMember = firstParameter.members[1] as ESField;
        //     expect(secondMember).toBeInstanceOf(ESField);
        //     expect(secondMember.identifier).toBe('param2');
        //     expect(secondMember.value).toBeInstanceOf(ESExpression);

        //     const secondParameter = parameters[1] as ESDestructuredArray;
        //     expect(secondParameter).toBeInstanceOf(ESDestructuredArray);
        //     expect(secondParameter.members.length).toBe(2);
            
        //     const thirdMember = secondParameter.members[0] as ESField;
        //     expect(thirdMember).toBeInstanceOf(ESField);
        //     expect(thirdMember.identifier).toBe('param3');
        //     expect(thirdMember.value).toBeInstanceOf(ESExpression);

        //     const fourthMember = secondParameter.members[1] as ESField;
        //     expect(fourthMember).toBeInstanceOf(ESField);
        //     expect(fourthMember.identifier).toBe('param4');
        //     expect(fourthMember.value).toBeInstanceOf(ESExpression);
        // });

        // it('should parse a function with destructuring rest parameters', () =>
        // {
        //     const funktion = parser.parseFunction(FUNCTIONS.DESTRUCTURING_REST_PARAMETERS);
        //     expect(funktion.identifier).toBe('name');
        //     expect(funktion.isAsync).toBe(false);
        //     expect(funktion.body.toString()).toBe('{ }');

        //     const parameters = funktion.parameters;
        //     expect(parameters.length).toBe(2);

        //     const firstParameter = parameters[0] as ESDestructuredObject;
        //     expect(firstParameter).toBeInstanceOf(ESDestructuredObject);
        //     expect(firstParameter.members.length).toBe(2);
            
        //     const firstMember = firstParameter.members[0] as ESField;
        //     expect(firstMember).toBeInstanceOf(ESField);
        //     expect(firstMember.identifier).toBe('param1');
        //     expect(firstMember.value).toBeUndefined();

        //     const secondMember = firstParameter.members[1] as ESField;
        //     expect(secondMember).toBeInstanceOf(ESField);
        //     expect(secondMember.identifier).toBe('param2');
        //     expect(secondMember.value).toBeUndefined();

        //     const secondParameter = parameters[1] as ESDestructuredArray;
        //     expect(secondParameter).toBeInstanceOf(ESDestructuredArray);
        //     expect(secondParameter.members.length).toBe(2);
            
        //     const thirdMember = secondParameter.members[0] as ESField;
        //     expect(thirdMember).toBeInstanceOf(ESField);
        //     expect(thirdMember.identifier).toBe('param3');
        //     expect(thirdMember.value).toBeUndefined();

        //     const fourthMember = secondParameter.members[1] as ESField;
        //     expect(fourthMember).toBeInstanceOf(ESField);
        //     expect(fourthMember.identifier).toBe('...param4');
        //     expect(fourthMember.value).toBeUndefined();
        // });

        it('should parse a simple function body', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.SIMPLE_BODY);

            expect(funktion.identifier).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.body.toString()).toBe("{ return 'value' ; }");

            const parameters = funktion.parameters;
            expect(parameters.length).toBe(0);
        });

        it('should parse a block function body', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.BLOCK_BODY);

            expect(funktion.identifier).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.body.toString()).toBe("{ if ( true ) { return 'value' ; } }");

            const parameters = funktion.parameters;
            expect(parameters.length).toBe(0);
        });

        it('should parse function with a non reserved keyword as name', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.KEYWORD_AS_NAME);

            expect(funktion.identifier).toBe('as');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.body.toString()).toBe("{ }");

            const parameters = funktion.parameters;
            expect(parameters.length).toBe(0);
        });
    });

    describe('.parseClass(code)', () =>
    {
        it('should be ok', () => 
        {

        });

    //     it('should parse a simple class declaration', () =>
    //     {
    //         const clazz = parser.parseClass(CLASSES.DECLARATION);
    //         expect(clazz.identifier).toBe('Name');
    //         expect(clazz.parentName).toBeUndefined();

    //         const members = clazz.members;
    //         expect(members.length).toBe(0);
    //     });

    //     it('should parse a simple class declaration with parent class', () =>
    //     {
    //         const clazz = parser.parseClass(CLASSES.EXTENDS);
    //         expect(clazz.identifier).toBe('Name');
    //         expect(clazz.parentName).toBe('Parent');
            
    //         const members = clazz.members;
    //         expect(members.length).toBe(0);
    //     });

    //     it('should parse an expression class declaration', () =>
    //     {
    //         const clazz = parser.parseClass(CLASSES.EXPRESSION);
    //         expect(clazz.identifier).toBe('name');
    //         expect(clazz.parentName).toBeUndefined();

    //         const members = clazz.members;
    //         expect(members.length).toBe(0);
    //     });

    //     it('should parse class members', () =>
    //     {
    //         const clazz = parser.parseClass(CLASSES.MEMBERS);
    //         expect(clazz.identifier).toBe('Name');
    //         expect(clazz.parentName).toBeUndefined();

    //         const members = clazz.members;
    //         expect(members.length).toBe(21);

    //         const variables = clazz.declarations;
    //         expect(declarations.length).toBe(4);

    //         expect(declarations[0].identifier).toBe('field1');
    //         expect(declarations[0].isPrivate).toBe(true);
    //         expect(declarations[0].isStatic).toBe(false);
    //         expect(declarations[0].value?.definition).toBe("'value1'");

    //         expect(declarations[1].identifier).toBe('field2');
    //         expect(declarations[1].isPrivate).toBe(false);
    //         expect(declarations[1].isStatic).toBe(false);
    //         expect(declarations[1].value).toBeUndefined();

    //         expect(declarations[2].identifier).toBe('field3');
    //         expect(declarations[2].isPrivate).toBe(true);
    //         expect(declarations[2].isStatic).toBe(true);
    //         expect(declarations[2].value?.definition).toBe('"value3"');

    //         expect(declarations[3].identifier).toBe('field4');
    //         expect(declarations[3].isPrivate).toBe(false);
    //         expect(declarations[3].isStatic).toBe(true);
    //         expect(declarations[3].value).toBeUndefined();

    //         const getters = clazz.getters;
    //         expect(getters.length).toBe(4);

    //         expect(getters[0].identifier).toBe('getter1');
    //         expect(getters[0].isPrivate).toBe(true);
    //         expect(getters[0].isStatic).toBe(false);

    //         expect(getters[1].identifier).toBe('getter2');
    //         expect(getters[1].isPrivate).toBe(false);
    //         expect(getters[1].isStatic).toBe(false);

    //         expect(getters[2].identifier).toBe('getter3');
    //         expect(getters[2].isPrivate).toBe(true);
    //         expect(getters[2].isStatic).toBe(true);

    //         expect(getters[3].identifier).toBe('getter4');
    //         expect(getters[3].isPrivate).toBe(false);
    //         expect(getters[3].isStatic).toBe(true);

    //         const setters = clazz.setters;
    //         expect(setters.length).toBe(4);

    //         expect(setters[0].identifier).toBe('setter1');
    //         expect(setters[0].isPrivate).toBe(true);
    //         expect(setters[0].isStatic).toBe(false);

    //         expect(setters[1].identifier).toBe('setter2');
    //         expect(setters[1].isPrivate).toBe(false);
    //         expect(setters[1].isStatic).toBe(false);

    //         expect(setters[2].identifier).toBe('setter3');
    //         expect(setters[2].isPrivate).toBe(true);
    //         expect(setters[2].isStatic).toBe(true);

    //         expect(setters[3].identifier).toBe('setter4');
    //         expect(setters[3].isPrivate).toBe(false);
    //         expect(setters[3].isStatic).toBe(true);

    //         const functions = clazz.functions;
    //         expect(functions.length).toBe(6);

    //         expect(functions[0].identifier).toBe('constructor');
    //         expect(functions[0].isPrivate).toBe(false);
    //         expect(functions[0].isStatic).toBe(false);
    //         expect(functions[0].isAsync).toBe(false);

    //         expect(functions[1].identifier).toBe('method1');
    //         expect(functions[1].isPrivate).toBe(false);
    //         expect(functions[1].isStatic).toBe(false);
    //         expect(functions[1].isAsync).toBe(false);

    //         expect(functions[2].identifier).toBe('method2');
    //         expect(functions[2].isPrivate).toBe(false);
    //         expect(functions[2].isStatic).toBe(false);
    //         expect(functions[2].isAsync).toBe(true);

    //         expect(functions[3].identifier).toBe('method3');
    //         expect(functions[3].isPrivate).toBe(false);
    //         expect(functions[3].isStatic).toBe(true);
    //         expect(functions[3].isAsync).toBe(false);

    //         expect(functions[4].identifier).toBe('method4');
    //         expect(functions[4].isPrivate).toBe(false);
    //         expect(functions[4].isStatic).toBe(true);
    //         expect(functions[4].isAsync).toBe(true);

    //         expect(functions[5].identifier).toBe('method5');
    //         expect(functions[5].isPrivate).toBe(true);
    //         expect(functions[5].isStatic).toBe(false);
    //         expect(functions[5].isAsync).toBe(false);

    //         const generators = clazz.generators;
    //         expect(generators.length).toBe(3);

    //         expect(generators[0].identifier).toBe('generator1');
    //         expect(generators[0].isPrivate).toBe(false);
    //         expect(generators[0].isStatic).toBe(false);
    //         expect(generators[0].isAsync).toBe(false);

    //         expect(generators[1].identifier).toBe('generator2');
    //         expect(generators[1].isPrivate).toBe(false);
    //         expect(generators[1].isStatic).toBe(false);
    //         expect(generators[1].isAsync).toBe(true);

    //         expect(generators[2].identifier).toBe('generator3');
    //         expect(generators[2].isPrivate).toBe(false);
    //         expect(generators[2].isStatic).toBe(true);
    //         expect(generators[2].isAsync).toBe(true);
    //     });
    });

    describe('.parse(code)', () =>
    {
        it('should be ok', () => 
        {

        });

    //     it('should parse an empty module', () =>
    //     {
    //         const module = parser.parse('');
            
    //         const members = module.members;
    //         expect(members.length).toBe(0);
    //     });

    //     it('should parse omit root level expressions', () =>
    //     {
    //         const module = parser.parse(VALUES.EXPRESSION);
            
    //         const members = module.members;
    //         expect(members.length).toBe(0);
    //     });

    //     it('should parse a module with terminated statements', () =>
    //     {
    //         const module = parser.parse(MODULES.TERMINATED);
            
    //         const members = module.members;
    //         expect(members.length).toBe(14);

    //         const imports = module.imports;
    //         expect(imports.length).toBe(2);

    //         const exports = module.exports;
    //         expect(exports.length).toBe(4);

    //         const variables = module.declarations;
    //         expect(declarations.length).toBe(4);

    //         const functions = module.functions;
    //         expect(functions.length).toBe(3);

    //         const classes = module.classes;
    //         expect(classes.length).toBe(1);
    //     });

    //     it('should parse a module with unterminated statements', () =>
    //     {
    //         const module = parser.parse(MODULES.UNTERMINATED);
            
    //         const members = module.members;
    //         expect(members.length).toBe(9);

    //         const imports = module.imports;
    //         expect(imports.length).toBe(2);

    //         const exports = module.exports;
    //         expect(exports.length).toBe(3);

    //         const variables = module.declarations;
    //         expect(declarations.length).toBe(2);

    //         const functions = module.functions;
    //         expect(functions.length).toBe(1);

    //         const classes = module.classes;
    //         expect(classes.length).toBe(1);
    //     });
    });
});
