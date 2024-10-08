
import { describe, expect, it } from 'vitest';

import { ESArray, ESObject, ESExpression, ESField, ESGenerator, ESDestructuredArray, ESDestructuredObject } from '../../src/models';
import { Parser } from '../../src/static';

import { VALUES, IMPORTS, EXPORTS, DECLARATIONS, FUNCTIONS, CLASSES, MODULES } from './fixtures';

const parser = new Parser();

describe('parser/Parser', () =>
{
    describe('.parseValue(code)', () =>
    {
        it('should parse an array', () =>
        {
            const value = parser.parseValue(VALUES.ARRAY);
            expect(value).toBeInstanceOf(ESArray);
            expect(value.definition).toBe('[ 1 , "foo" , false , new Person ( "Peter" , 42 ) , { a : 1 , b : 2 } ]');
        });

        it('should parse an object', () =>
        {
            const value = parser.parseValue(VALUES.OBJECT);
            expect(value).toBeInstanceOf(ESObject);
            expect(value.definition).toBe('{ key1 : "value1" , "key2" : new Person ( ) .toString ( ) }');
        });

        it('should parse an expression', () =>
        {
            const value = parser.parseValue(VALUES.EXPRESSION);
            expect(value).toBeInstanceOf(ESExpression);
            expect(value.definition).toBe('new Number ( Math.ceil ( Math.random ( ) ) + 10 ) .toString ( )');
        });

        it('should parse a grouped expression', () =>
        {
            const value = parser.parseValue(VALUES.EXPRESSION_GROUP);
            expect(value).toBeInstanceOf(ESExpression);
            expect(value.definition).toBe('( a + b ) * c');
        });

        it('should parse an if...else expression', () =>
        {
            const value = parser.parseValue(VALUES.IF_ELSE);
            expect(value).toBeInstanceOf(ESExpression);
            expect(value.definition).toBe('if ( true ) { return "value1" ; } else { return "value2" ; }');
        });

        it('should parse an try...catch...finally expression', () =>
        {
            const value = parser.parseValue(VALUES.TRY_CATCH_FINALLY);
            expect(value).toBeInstanceOf(ESExpression);
            expect(value.definition).toBe('try { sum ( 1 , 2 ) ; } catch ( error ) { console.error ( error ) ; } finally { console.log ( "finally" ) ; }');
        });
    });

    describe('.parseImport(code)', () =>
    {
        it('should parse loading a module', () =>
        {
            const imported = parser.parseImport(IMPORTS.LOAD);
            expect(imported.members.length).toBe(0);
            expect(imported.from).toBe("'module'");
        });

        it('should parse importing a single member', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT);
            expect(imported.members.length).toBe(1);
            expect(imported.from).toBe("'module'");

            const member = imported.members[0];
            expect(member.name).toBe('member');
            expect(member.as).toBe('member');
        });

        it('should parse importing a single member with alias', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT_AS);
            expect(imported.members.length).toBe(1);
            expect(imported.from).toBe("'module'");

            const member = imported.members[0];
            expect(member.name).toBe('member');
            expect(member.as).toBe('alias');
        });

        it('should parse importing all members', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT_ALL);
            expect(imported.members.length).toBe(1);
            expect(imported.from).toBe("'module'");

            const member = imported.members[0];
            expect(member.name).toBe('*');
            expect(member.as).toBe('name');
        });

        it('should parse importing the default member', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT_DEFAULT);
            expect(imported.members.length).toBe(1);
            expect(imported.from).toBe("'module'");

            const member = imported.members[0];
            expect(member.name).toBe('default');
            expect(member.as).toBe('name');
        });

        it('should parse importing the default with another member', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT_DEFAULT_MEMBER);
            expect(imported.members.length).toBe(2);
            expect(imported.from).toBe("'module'");

            const first = imported.members[0];
            expect(first.name).toBe('default');
            expect(first.as).toBe('name');

            const second = imported.members[1];
            expect(second.name).toBe('member');
            expect(second.as).toBe('member');
        });

        it('should parse importing the default with another member with alias', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT_DEFAULT_MEMBER_AS);
            expect(imported.members.length).toBe(2);
            expect(imported.from).toBe("'module'");

            const first = imported.members[0];
            expect(first.name).toBe('default');
            expect(first.as).toBe('name');

            const second = imported.members[1];
            expect(second.name).toBe('member');
            expect(second.as).toBe('alias');
        });

        it('should parse importing the default with other members and aliases', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT_MULTIPLE_MEMBERS_AS);
            expect(imported.members.length).toBe(2);
            expect(imported.from).toBe("'module'");

            const first = imported.members[0];
            expect(first.name).toBe('name');
            expect(first.as).toBe('name');

            const second = imported.members[1];
            expect(second.name).toBe('member');
            expect(second.as).toBe('alias');
        });

        it('should parse importing modules dynamically', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT_DYNAMIC);
            expect(imported.members.length).toBe(0);
            expect(imported.from).toBe("'module'");
        });
    });

    describe('.parseExport(code)', () =>
    {
        it('should parse exporting a single member', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT);
            expect(exported.members.length).toBe(1);
            expect(exported.from).toBe(undefined);

            const member = exported.members[0];
            expect(member.name).toBe('member');
            expect(member.as).toBe('member');
        });

        it('should parse exporting a single member with alias', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT_AS);
            expect(exported.members.length).toBe(1);
            expect(exported.from).toBe(undefined);

            const member = exported.members[0];
            expect(member.name).toBe('member');
            expect(member.as).toBe('alias');
        });

        it('should parse exporting a default', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT_DEFAULT);
            expect(exported.members.length).toBe(1);
            expect(exported.from).toBe(undefined);

            const member = exported.members[0];
            expect(member.name).toBe('name');
            expect(member.as).toBe('default');
        });

        it('should parse exporting multiple members', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT_MULTIPLE);
            expect(exported.members.length).toBe(2);
            expect(exported.from).toBe(undefined);

            const first = exported.members[0];
            expect(first.name).toBe('name');
            expect(first.as).toBe('name');

            const second = exported.members[1];
            expect(second.name).toBe('member');
            expect(second.as).toBe('member');
        });

        it('should parse exporting multiple members with alias', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT_MULTIPLE_AS);
            expect(exported.members.length).toBe(2);
            expect(exported.from).toBe(undefined);

            const first = exported.members[0];
            expect(first.name).toBe('name');
            expect(first.as).toBe('name');

            const second = exported.members[1];
            expect(second.name).toBe('member');
            expect(second.as).toBe('alias');
        });

        it('should parse exporting a class declaration', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT_CLASS_DECLARATION);
            expect(exported.members.length).toBe(1);
            expect(exported.from).toBe(undefined);

            const member = exported.members[0];
            expect(member.name).toBe('name');
            expect(member.as).toBe('name');
        });

        it('should parse exporting a function declaration', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT_FUNCTION_DECLARATION);
            expect(exported.members.length).toBe(1);
            expect(exported.from).toBe(undefined);

            const member = exported.members[0];
            expect(member.name).toBe('name');
            expect(member.as).toBe('name');
        });

        it('should parse exporting a async function declaration', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT_FIELD_DECLARATION);
            expect(exported.members.length).toBe(1);
            expect(exported.from).toBe(undefined);

            const member = exported.members[0];
            expect(member.name).toBe('name');
            expect(member.as).toBe('name');
        });

        it('should parse reexporting a module', () =>
        {
            const exported = parser.parseExport(EXPORTS.REEXPORT_ALL);
            expect(exported.members.length).toBe(1);
            expect(exported.from).toBe("'module'");

            const member = exported.members[0];
            expect(member.name).toBe('');
            expect(member.as).toBe('');
        });

        it('should parse reexporting a member', () =>
        {
            const exported = parser.parseExport(EXPORTS.REEXPORT_MEMBER);
            expect(exported.members.length).toBe(1);
            expect(exported.from).toBe("'module'");

            const member = exported.members[0];
            expect(member.name).toBe('member');
            expect(member.as).toBe('member');
        });
    });

    describe('.parseDeclaration(code)', () =>
    {
        it('should parse an empty declaration', () =>
        {
            const declaration = parser.parseDeclaration(DECLARATIONS.EMPTY);

            expect(declaration.name).toBe('name');
            expect(declaration.value).toBe(undefined);
        });

        it('should parse a const declaration', () =>
        {
            const declaration = parser.parseDeclaration(DECLARATIONS.CONST);

            expect(declaration.name).toBe('name');
            expect(declaration.value).toBeInstanceOf(ESExpression);
            expect(declaration.value?.definition).toBe("'const'");
        });

        it('should parse a let declaration with value', () =>
        {
            const declaration = parser.parseDeclaration(DECLARATIONS.LET);

            expect(declaration.name).toBe('name');
            expect(declaration.value).toBeInstanceOf(ESExpression);
            expect(declaration.value?.definition).toBe("'let'");
        });

        it('should parse a var declaration with value', () =>
        {
            const declaration = parser.parseDeclaration(DECLARATIONS.VAR);

            expect(declaration.name).toBe('name');
            expect(declaration.value).toBeInstanceOf(ESExpression);
            expect(declaration.value?.definition).toBe("'var'");
        });

        it('should parse a declaration with multiple declarations', () =>
        {
            const declaration = parser.parseDeclaration(DECLARATIONS.MULTIPLE);

            expect(declaration.name).toBe('name1');
            expect(declaration.value).toBeInstanceOf(ESExpression);
            expect(declaration.value?.definition).toBe('( 1 + 2 ) * 3');
        });

        it('should parse a declaration with an expression', () =>
        {
            const declaration = parser.parseDeclaration(DECLARATIONS.EXPRESSION);

            expect(declaration.name).toBe('number');
            expect(declaration.value).toBeInstanceOf(ESExpression);
            expect(declaration.value?.definition).toBe("new Number ( Math.ceil ( Math.random ( ) ) + 10 ) .toString ( )");
        });

        it('should parse a declaration with an array value', () =>
        {
            const declaration = parser.parseDeclaration(DECLARATIONS.ARRAY);

            expect(declaration.name).toBe('array');
            expect(declaration.value).toBeInstanceOf(ESArray);
            expect(declaration.value?.definition).toBe("[ 'value1' , 'value2' ]");
        });

        it('should parse a declaration with an array value', () =>
        {
            const declaration = parser.parseDeclaration(DECLARATIONS.OBJECT);

            expect(declaration.name).toBe('object');
            expect(declaration.value).toBeInstanceOf(ESObject);
            expect(declaration.value?.definition).toBe("{ key1 : 'value1' , key2 : 'value2' }");
        });

        it('should parse a declaration with a regex value', () =>
        {
            const declaration = parser.parseDeclaration(DECLARATIONS.REGEX);

            expect(declaration.name).toBe('regex');
            expect(declaration.value).toBeInstanceOf(ESExpression);
            expect(declaration.value?.definition).toBe("/regex/g");
        });

        it('should parse a declaration that is destructuring an array', () =>
        {
            const declaration = parser.parseDeclaration(DECLARATIONS.DESTRUCTURING_ARRAY);

            expect(declaration.name).toBe('[ value1 , value2 = true ]');
            expect(declaration.value).toBeInstanceOf(ESExpression);
            expect(declaration.identifier).toBeInstanceOf(ESDestructuredArray);

            const identifier = declaration.identifier as ESDestructuredArray;
            expect(identifier.members.length).toBe(2);
            
            const firstMember = identifier.members[0] as ESField;
            expect(firstMember).toBeInstanceOf(ESField);
            expect(firstMember.name).toBe('value1');
            expect(firstMember.value).toBe(undefined);

            const secondMember = identifier.members[1] as ESField;
            expect(secondMember).toBeInstanceOf(ESField);
            expect(secondMember.name).toBe('value2');
            expect(secondMember.value).toBeInstanceOf(ESExpression);
            expect(secondMember.value?.definition).toBe('true');
        });

        it('should parse a declaration that is destructuring an object', () =>
        {
            const declaration = parser.parseDeclaration(DECLARATIONS.DESTRUCTURING_OBJECT);

            expect(declaration.name).toBe('{ key1 , key2 = false }');
            expect(declaration.value).toBeInstanceOf(ESExpression);
            expect(declaration.identifier).toBeInstanceOf(ESDestructuredObject);

            const identifier = declaration.identifier as ESDestructuredArray;
            expect(identifier.members.length).toBe(2);

            const firstMember = identifier.members[0] as ESField;
            expect(firstMember).toBeInstanceOf(ESField);
            expect(firstMember.name).toBe('key1');

            const secondMember = identifier.members[1] as ESField;
            expect(secondMember).toBeInstanceOf(ESField);
            expect(secondMember.name).toBe('key2');
            expect(secondMember.value).toBeInstanceOf(ESExpression);
            expect(secondMember.value?.definition).toBe('false');
        });

        it('should parse a declaration with a non reserved keyword as name', () =>
        {
            const declaration = parser.parseDeclaration(DECLARATIONS.KEYWORD_AS_NAME);

            expect(declaration.name).toBe('as');
            expect(declaration.value).toBeInstanceOf(ESExpression);
            expect(declaration.value?.definition).toBe("'value'");
        });

        it('should parse a declaration that refers to a non reserved keyword as value', () =>
        {
            const declaration = parser.parseDeclaration(DECLARATIONS.KEYWORD_AS_VALUE);

            expect(declaration.name).toBe('alias');
            expect(declaration.value).toBeInstanceOf(ESExpression);
            expect(declaration.value?.definition).toBe('as');
        });
    });

    describe('.parseFunction(code)', () =>
    {
        it('should parse a simple function declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.DECLARATION);

            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body).toBe('{ }');
        });

        it('should parse an async function declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.ASYNC_DECLARATION);

            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(true);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body).toBe('{ }');
        });

        it('should parse an expression function declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.EXPRESSION);

            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body).toBe('{ }');
        });

        it('should parse an async expression function declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.ASYNC_EXPRESSION);

            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(true);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body).toBe('{ }');
        });

        it('should parse an arrow function declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.ARROW);

            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body).toBe('{ }');
        });

        it('should parse an arrow function expression declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.ARROW_EXPRESSION);

            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body).toBe("'value'");
        });

        it('should parse an arrow function argument declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.ARROW_ARGUMENT);

            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.parameters.length).toBe(1);
            expect(funktion.body).toBe('arg');
        });

        it('should parse an async arrow function declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.ASYNC_ARROW);

            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(true);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body).toBe('{ }');
        });

        it('should parse a generator function declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.GENERATOR);

            expect(funktion).toBeInstanceOf(ESGenerator);
            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body).toBe('{ }');
        });

        it('should parse an async generator function declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.ASYNC_GENERATOR);

            expect(funktion).toBeInstanceOf(ESGenerator);
            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(true);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body).toBe('{ }');
        });

        it('should parse an expression generator function declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.EXPRESSION_GENERATOR);

            expect(funktion).toBeInstanceOf(ESGenerator);
            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body).toBe('{ }');
        });

        it('should parse an async expression generator function declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.ASYNC_EXPRESSION_GENERATOR);

            expect(funktion).toBeInstanceOf(ESGenerator);
            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(true);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body).toBe('{ }');
        });

        it('should parse a function with parameters', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.PARAMETERS);
            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.body).toBe('{ }');

            const parameters = funktion.parameters;
            expect(parameters.length).toBe(2);

            const first = parameters[0] as ESField;
            expect(first).toBeInstanceOf(ESField);
            expect(first.name).toBe('param1');
            expect(first.value).toBe(undefined);

            const second = parameters[1] as ESField;
            expect(second).toBeInstanceOf(ESField);
            expect(second.name).toBe('param2');
            expect(second.value).toBe(undefined);
        });

        it('should parse a function with default parameters', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.DEFAULT_PARAMETERS);
            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.body).toBe('{ }');

            const parameters = funktion.parameters;
            expect(parameters.length).toBe(2);

            const first = parameters[0] as ESField;
            expect(first).toBeInstanceOf(ESField);
            expect(first.name).toBe('param1');
            expect(first.value).toEqual(new ESExpression("'value1'"));

            const second = parameters[1] as ESField;
            expect(second).toBeInstanceOf(ESField);
            expect(second.name).toBe('param2');
            expect(second.value).toEqual(new ESExpression("true"));
        });

        it('should parse a function with a rest parameter', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.REST_PARAMETERS);
            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.body).toBe('{ }');

            const parameters = funktion.parameters;
            expect(parameters.length).toBe(1);

            const first = parameters[0] as ESField;
            expect(first).toBeInstanceOf(ESField);
            expect(first.name).toBe('...param1');
            expect(first.value).toEqual(undefined);
        });

        it('should parse a function with destructuring parameters', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.DESTRUCTURING_PARAMETERS);
            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.body).toBe('{ }');

            const parameters = funktion.parameters;
            expect(parameters.length).toBe(2);

            const firstParameter = parameters[0] as ESDestructuredObject;
            expect(firstParameter).toBeInstanceOf(ESDestructuredObject);
            expect(firstParameter.members.length).toBe(2);

            const firstMember = firstParameter.members[0] as ESField;
            expect(firstMember).toBeInstanceOf(ESField);
            expect(firstMember.name).toBe('param1');
            expect(firstMember.value).toBe(undefined);

            const secondMember = firstParameter.members[1] as ESField;
            expect(secondMember).toBeInstanceOf(ESField);
            expect(secondMember.name).toBe('param2');
            expect(secondMember.value).toBe(undefined);

            const secondParameter = parameters[1] as ESDestructuredArray;
            expect(secondParameter).toBeInstanceOf(ESDestructuredArray);
            expect(secondParameter.members.length).toBe(2);

            const thirdMember = secondParameter.members[0] as ESField;
            expect(thirdMember).toBeInstanceOf(ESField);
            expect(thirdMember.name).toBe('param3');
            expect(thirdMember.value).toBe(undefined);

            const fourthMember = secondParameter.members[1] as ESField;
            expect(fourthMember).toBeInstanceOf(ESField);
            expect(fourthMember.name).toBe('param4');
            expect(fourthMember.value).toBe(undefined);
        });

        it('should parse a function with destructuring default parameters', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.DESTRUCTURING_DEFAULT_PARAMETERS);
            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.body).toBe('{ }');

            const parameters = funktion.parameters;
            expect(parameters.length).toBe(2);

            const firstParameter = parameters[0] as ESDestructuredObject;
            expect(firstParameter).toBeInstanceOf(ESDestructuredObject);
            expect(firstParameter.members.length).toBe(2);
            
            const firstMember = firstParameter.members[0] as ESField;
            expect(firstMember).toBeInstanceOf(ESField);
            expect(firstMember.name).toBe('param1');
            expect(firstMember.value).toBeInstanceOf(ESExpression);

            const secondMember = firstParameter.members[1] as ESField;
            expect(secondMember).toBeInstanceOf(ESField);
            expect(secondMember.name).toBe('param2');
            expect(secondMember.value).toBeInstanceOf(ESExpression);

            const secondParameter = parameters[1] as ESDestructuredArray;
            expect(secondParameter).toBeInstanceOf(ESDestructuredArray);
            expect(secondParameter.members.length).toBe(2);
            
            const thirdMember = secondParameter.members[0] as ESField;
            expect(thirdMember).toBeInstanceOf(ESField);
            expect(thirdMember.name).toBe('param3');
            expect(thirdMember.value).toBeInstanceOf(ESExpression);

            const fourthMember = secondParameter.members[1] as ESField;
            expect(fourthMember).toBeInstanceOf(ESField);
            expect(fourthMember.name).toBe('param4');
            expect(fourthMember.value).toBeInstanceOf(ESExpression);
        });

        it('should parse a function with destructuring rest parameters', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.DESTRUCTURING_REST_PARAMETERS);
            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.body).toBe('{ }');

            const parameters = funktion.parameters;
            expect(parameters.length).toBe(2);

            const firstParameter = parameters[0] as ESDestructuredObject;
            expect(firstParameter).toBeInstanceOf(ESDestructuredObject);
            expect(firstParameter.members.length).toBe(2);
            
            const firstMember = firstParameter.members[0] as ESField;
            expect(firstMember).toBeInstanceOf(ESField);
            expect(firstMember.name).toBe('param1');
            expect(firstMember.value).toBe(undefined);

            const secondMember = firstParameter.members[1] as ESField;
            expect(secondMember).toBeInstanceOf(ESField);
            expect(secondMember.name).toBe('param2');
            expect(secondMember.value).toBe(undefined);

            const secondParameter = parameters[1] as ESDestructuredArray;
            expect(secondParameter).toBeInstanceOf(ESDestructuredArray);
            expect(secondParameter.members.length).toBe(2);
            
            const thirdMember = secondParameter.members[0] as ESField;
            expect(thirdMember).toBeInstanceOf(ESField);
            expect(thirdMember.name).toBe('param3');
            expect(thirdMember.value).toBe(undefined);

            const fourthMember = secondParameter.members[1] as ESField;
            expect(fourthMember).toBeInstanceOf(ESField);
            expect(fourthMember.name).toBe('...param4');
            expect(fourthMember.value).toBe(undefined);
        });

        it('should parse a simple function body', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.SIMPLE_BODY);
            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.body).toBe("{ return 'value' ; }");

            const parameters = funktion.parameters;
            expect(parameters.length).toBe(0);
        });

        it('should parse a block function body', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.BLOCK_BODY);
            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.body).toBe("{ if ( true ) { return 'value' ; } }");

            const parameters = funktion.parameters;
            expect(parameters.length).toBe(0);
        });

        it('should parse function with a non reserved keyword as name', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.KEYWORD_AS_NAME);
            expect(funktion.name).toBe('as');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.body).toBe("{ }");

            const parameters = funktion.parameters;
            expect(parameters.length).toBe(0);
        });
    });

    describe('.parseClass(code)', () =>
    {
        it('should parse a simple class declaration', () =>
        {
            const clazz = parser.parseClass(CLASSES.DECLARATION);
            expect(clazz.name).toBe('Name');
            expect(clazz.parentName).toBe(undefined);

            const members = clazz.members;
            expect(members.length).toBe(0);
        });

        it('should parse a simple class declaration with parent class', () =>
        {
            const clazz = parser.parseClass(CLASSES.EXTENDS);
            expect(clazz.name).toBe('Name');
            expect(clazz.parentName).toBe('Parent');
            
            const members = clazz.members;
            expect(members.length).toBe(0);
        });

        it('should parse an expression class declaration', () =>
        {
            const clazz = parser.parseClass(CLASSES.EXPRESSION);
            expect(clazz.name).toBe('name');
            expect(clazz.parentName).toBe(undefined);

            const members = clazz.members;
            expect(members.length).toBe(0);
        });

        it('should parse class members', () =>
        {
            const clazz = parser.parseClass(CLASSES.MEMBERS);
            expect(clazz.name).toBe('Name');
            expect(clazz.parentName).toBe(undefined);

            const members = clazz.members;
            expect(members.length).toBe(21);

            const declarations = clazz.declarations;
            expect(declarations.length).toBe(4);

            expect(declarations[0].name).toBe('field1');
            expect(declarations[0].isPrivate).toBe(true);
            expect(declarations[0].isStatic).toBe(false);
            expect(declarations[0].value?.definition).toBe("'value1'");

            expect(declarations[1].name).toBe('field2');
            expect(declarations[1].isPrivate).toBe(false);
            expect(declarations[1].isStatic).toBe(false);
            expect(declarations[1].value).toBe(undefined);

            expect(declarations[2].name).toBe('field3');
            expect(declarations[2].isPrivate).toBe(true);
            expect(declarations[2].isStatic).toBe(true);
            expect(declarations[2].value?.definition).toBe('"value3"');

            expect(declarations[3].name).toBe('field4');
            expect(declarations[3].isPrivate).toBe(false);
            expect(declarations[3].isStatic).toBe(true);
            expect(declarations[3].value).toBe(undefined);

            const getters = clazz.getters;
            expect(getters.length).toBe(4);

            expect(getters[0].name).toBe('getter1');
            expect(getters[0].isPrivate).toBe(true);
            expect(getters[0].isStatic).toBe(false);

            expect(getters[1].name).toBe('getter2');
            expect(getters[1].isPrivate).toBe(false);
            expect(getters[1].isStatic).toBe(false);

            expect(getters[2].name).toBe('getter3');
            expect(getters[2].isPrivate).toBe(true);
            expect(getters[2].isStatic).toBe(true);

            expect(getters[3].name).toBe('getter4');
            expect(getters[3].isPrivate).toBe(false);
            expect(getters[3].isStatic).toBe(true);

            const setters = clazz.setters;
            expect(setters.length).toBe(4);

            expect(setters[0].name).toBe('setter1');
            expect(setters[0].isPrivate).toBe(true);
            expect(setters[0].isStatic).toBe(false);

            expect(setters[1].name).toBe('setter2');
            expect(setters[1].isPrivate).toBe(false);
            expect(setters[1].isStatic).toBe(false);

            expect(setters[2].name).toBe('setter3');
            expect(setters[2].isPrivate).toBe(true);
            expect(setters[2].isStatic).toBe(true);

            expect(setters[3].name).toBe('setter4');
            expect(setters[3].isPrivate).toBe(false);
            expect(setters[3].isStatic).toBe(true);

            const functions = clazz.functions;
            expect(functions.length).toBe(6);

            expect(functions[0].name).toBe('constructor');
            expect(functions[0].isPrivate).toBe(false);
            expect(functions[0].isStatic).toBe(false);
            expect(functions[0].isAsync).toBe(false);

            expect(functions[1].name).toBe('method1');
            expect(functions[1].isPrivate).toBe(false);
            expect(functions[1].isStatic).toBe(false);
            expect(functions[1].isAsync).toBe(false);

            expect(functions[2].name).toBe('method2');
            expect(functions[2].isPrivate).toBe(false);
            expect(functions[2].isStatic).toBe(false);
            expect(functions[2].isAsync).toBe(true);

            expect(functions[3].name).toBe('method3');
            expect(functions[3].isPrivate).toBe(false);
            expect(functions[3].isStatic).toBe(true);
            expect(functions[3].isAsync).toBe(false);

            expect(functions[4].name).toBe('method4');
            expect(functions[4].isPrivate).toBe(false);
            expect(functions[4].isStatic).toBe(true);
            expect(functions[4].isAsync).toBe(true);

            expect(functions[5].name).toBe('method5');
            expect(functions[5].isPrivate).toBe(true);
            expect(functions[5].isStatic).toBe(false);
            expect(functions[5].isAsync).toBe(false);

            const generators = clazz.generators;
            expect(generators.length).toBe(3);

            expect(generators[0].name).toBe('generator1');
            expect(generators[0].isPrivate).toBe(false);
            expect(generators[0].isStatic).toBe(false);
            expect(generators[0].isAsync).toBe(false);

            expect(generators[1].name).toBe('generator2');
            expect(generators[1].isPrivate).toBe(false);
            expect(generators[1].isStatic).toBe(false);
            expect(generators[1].isAsync).toBe(true);

            expect(generators[2].name).toBe('generator3');
            expect(generators[2].isPrivate).toBe(false);
            expect(generators[2].isStatic).toBe(true);
            expect(generators[2].isAsync).toBe(true);
        });
    });

    describe('.parse(code)', () =>
    {
        it('should parse an empty module', () =>
        {
            const module = parser.parse('');
            
            const members = module.members;
            expect(members.length).toBe(0);
        });

        it('should parse omit root level expressions', () =>
        {
            const module = parser.parse(VALUES.EXPRESSION);
            
            const members = module.members;
            expect(members.length).toBe(0);
        });

        it('should parse a module with terminated statements', () =>
        {
            const module = parser.parse(MODULES.TERMINATED);
            
            const members = module.members;
            expect(members.length).toBe(14);

            const imports = module.imports;
            expect(imports.length).toBe(2);

            const exports = module.exports;
            expect(exports.length).toBe(4);

            const declarations = module.declarations;
            expect(declarations.length).toBe(4);

            const functions = module.functions;
            expect(functions.length).toBe(3);

            const classes = module.classes;
            expect(classes.length).toBe(1);
        });

        it('should parse a module with unterminated statements', () =>
        {
            const module = parser.parse(MODULES.UNTERMINATED);
            
            const members = module.members;
            expect(members.length).toBe(9);

            const imports = module.imports;
            expect(imports.length).toBe(2);

            const exports = module.exports;
            expect(exports.length).toBe(3);

            const declarations = module.declarations;
            expect(declarations.length).toBe(2);

            const functions = module.functions;
            expect(functions.length).toBe(1);

            const classes = module.classes;
            expect(classes.length).toBe(1);
        });
    });
});
