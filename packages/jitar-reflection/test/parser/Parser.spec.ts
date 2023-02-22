
import ReflectionExpression from '../../src/models/ReflectionExpression';
import ReflectionArray from '../../src/models/ReflectionArray';
import ReflectionObject from '../../src/models/ReflectionObject';
import Parser from '../../src/parser/Parser';

import { VALUES, IMPORTS, EXPORTS, FIELDS, FUNCTIONS, CLASSES, MODULES } from '../_fixtures/parser/Parser.fixture';
import ReflectionField from '../../src/models/ReflectionField';
import ReflectionGenerator from '../../src/models/ReflectionGenerator';

const parser = new Parser();

describe('parser/Parser', () =>
{
    describe('.parseValue(code)', () =>
    {
        it('should parse an array', () =>
        {
            const value = parser.parseValue(VALUES.ARRAY);
            expect(value).toBeInstanceOf(ReflectionArray);
            expect(value.definition).toBe('[ 1 , "foo" , false , new Person ( "Peter" , 42 ) , { a : 1 , b : 2 } ]');
        });

        it('should parse an object', () =>
        {
            const value = parser.parseValue(VALUES.OBJECT);
            expect(value).toBeInstanceOf(ReflectionObject);
            expect(value.definition).toBe('{ key1 : "value1" , "key2" : new Person ( ) .toString ( ) }');
        });

        it('should parse an expression', () =>
        {
            const value = parser.parseValue(VALUES.EXPRESSION);
            expect(value).toBeInstanceOf(ReflectionExpression);
            expect(value.definition).toBe('new Number ( Math.ceil ( Math.random ( ) ) + 10 ) .toString ( )');
        });

        it('should parse a grouped expression', () =>
        {
            const value = parser.parseValue(VALUES.EXPRESSION_GROUP);
            expect(value).toBeInstanceOf(ReflectionExpression);
            expect(value.definition).toBe('( a + b ) * c');
        });

        it('should parse an if...else expression', () =>
        {
            const value = parser.parseValue(VALUES.IF_ELSE);
            expect(value).toBeInstanceOf(ReflectionExpression);
            expect(value.definition).toBe('if ( true ) { return "value1" ; } else { return "value2" ; }');
        });

        it('should parse an try...catch...finally expression', () =>
        {
            const value = parser.parseValue(VALUES.TRY_CATCH_FINALLY);
            expect(value).toBeInstanceOf(ReflectionExpression);
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
            expect(member.name).toBe('default');
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

    describe('.parseField(code)', () =>
    {
        it('should parse an empty field', () =>
        {
            const field = parser.parseField(FIELDS.EMPTY);

            expect(field.name).toBe('name');
            expect(field.value).toBe(undefined);
        });

        it('should parse a const field', () =>
        {
            const field = parser.parseField(FIELDS.CONST);

            expect(field.name).toBe('name');
            expect(field.value).toBeInstanceOf(ReflectionExpression);
            expect(field.value?.definition).toBe("'const'");
        });

        it('should parse a let field with value', () =>
        {
            const field = parser.parseField(FIELDS.LET);

            expect(field.name).toBe('name');
            expect(field.value).toBeInstanceOf(ReflectionExpression);
            expect(field.value?.definition).toBe("'let'");
        });

        it('should parse a var field with value', () =>
        {
            const field = parser.parseField(FIELDS.VAR);

            expect(field.name).toBe('name');
            expect(field.value).toBeInstanceOf(ReflectionExpression);
            expect(field.value?.definition).toBe("'var'");
        });

        it('should parse a field with multiple declarations', () =>
        {
            const field = parser.parseField(FIELDS.DECLARATIONS);

            expect(field.name).toBe('name1');
            expect(field.value).toBe(undefined);
        });

        it('should parse a field with an expression', () =>
        {
            const field = parser.parseField(FIELDS.EXPRESSION);

            expect(field.name).toBe('number');
            expect(field.value).toBeInstanceOf(ReflectionExpression);
            expect(field.value?.definition).toBe("new Number ( Math.ceil ( Math.random ( ) ) + 10 ) .toString ( )");
        });

        it('should parse a field with an array value', () =>
        {
            const field = parser.parseField(FIELDS.ARRAY);

            expect(field.name).toBe('array');
            expect(field.value).toBeInstanceOf(ReflectionArray);
            expect(field.value?.definition).toBe("[ 'value1' , 'value2' ]");
        });

        it('should parse a field with an array value', () =>
        {
            const field = parser.parseField(FIELDS.OBJECT);

            expect(field.name).toBe('object');
            expect(field.value).toBeInstanceOf(ReflectionObject);
            expect(field.value?.definition).toBe("{ key1 : 'value1' , key2 : 'value2' }");
        });

        it('should parse a field with an regex value', () =>
        {
            const field = parser.parseField(FIELDS.REGEX);

            expect(field.name).toBe('regex');
            expect(field.value).toBeInstanceOf(ReflectionExpression);
            expect(field.value?.definition).toBe("/ regex / g");
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

            expect(funktion).toBeInstanceOf(ReflectionGenerator);
            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body).toBe('{ }');
        });

        it('should parse an async generator function declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.ASYNC_GENERATOR);

            expect(funktion).toBeInstanceOf(ReflectionGenerator);
            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(true);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body).toBe('{ }');
        });

        it('should parse an expression generator function declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.EXPRESSION_GENERATOR);

            expect(funktion).toBeInstanceOf(ReflectionGenerator);
            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body).toBe('{ }');
        });

        it('should parse an async expression generator function declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.ASYNC_EXPRESSION_GENERATOR);

            expect(funktion).toBeInstanceOf(ReflectionGenerator);
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

            const first = parameters[0] as ReflectionField;
            expect(first).toBeInstanceOf(ReflectionField);
            expect(first.name).toBe('param1');
            expect(first.value).toBe(undefined);

            const second = parameters[1] as ReflectionField;
            expect(second).toBeInstanceOf(ReflectionField);
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

            const first = parameters[0] as ReflectionField;
            expect(first).toBeInstanceOf(ReflectionField);
            expect(first.name).toBe('param1');
            expect(first.value).toEqual(new ReflectionExpression("'value1'"));

            const second = parameters[1] as ReflectionField;
            expect(second).toBeInstanceOf(ReflectionField);
            expect(second.name).toBe('param2');
            expect(second.value).toEqual(new ReflectionExpression("true"));
        });

        it('should parse a function with a rest parameter', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.REST_PARAMETERS);
            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.body).toBe('{ }');

            const parameters = funktion.parameters;
            expect(parameters.length).toBe(1);

            const first = parameters[0] as ReflectionField;
            expect(first).toBeInstanceOf(ReflectionField);
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

            const first = parameters[0] as ReflectionObject;
            expect(first).toBeInstanceOf(ReflectionObject);
            expect(first.definition).toBe('{ param1 , param2 }');

            const second = parameters[1] as ReflectionArray;
            expect(second).toBeInstanceOf(ReflectionArray);
            expect(second.definition).toBe('[ param3 , param4 ]');
        });

        it('should parse a function with destructuring default parameters', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.DESTRUCTURING_DEFAULT_PARAMETERS);
            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.body).toBe('{ }');

            const parameters = funktion.parameters;
            expect(parameters.length).toBe(2);

            const first = parameters[0] as ReflectionObject;
            expect(first).toBeInstanceOf(ReflectionObject);
            expect(first.definition).toBe("{ param1 = 'value1' , param2 = true }");

            const second = parameters[1] as ReflectionArray;
            expect(second).toBeInstanceOf(ReflectionArray);
            expect(second.definition).toBe("[ param3 = 'value3' , param4 = true ]");
        });

        it('should parse a function with destructuring rest parameters', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.DESTRUCTURING_REST_PARAMETERS);
            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.body).toBe('{ }');

            const parameters = funktion.parameters;
            expect(parameters.length).toBe(2);

            const first = parameters[0] as ReflectionObject;
            expect(first).toBeInstanceOf(ReflectionObject);
            expect(first.definition).toBe('{ param1 , param2 }');

            const second = parameters[1] as ReflectionArray;
            expect(second).toBeInstanceOf(ReflectionArray);
            expect(second.definition).toBe('[ param3 , ...param4 ]');
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
            expect(members.length).toBe(18);

            const fields = clazz.fields;
            expect(fields.length).toBe(4);

            expect(fields[0].name).toBe('field1');
            expect(fields[0].isPrivate).toBe(true);
            expect(fields[0].isStatic).toBe(false);
            expect(fields[0].value?.definition).toBe("'value1'");

            expect(fields[1].name).toBe('field2');
            expect(fields[1].isPrivate).toBe(false);
            expect(fields[1].isStatic).toBe(false);
            expect(fields[1].value).toBe(undefined);

            expect(fields[2].name).toBe('field3');
            expect(fields[2].isPrivate).toBe(true);
            expect(fields[2].isStatic).toBe(true);
            expect(fields[2].value?.definition).toBe('"value3"');

            expect(fields[3].name).toBe('field4');
            expect(fields[3].isPrivate).toBe(false);
            expect(fields[3].isStatic).toBe(true);
            expect(fields[3].value).toBe(undefined);

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
            expect(members.length).toBe(9);

            const imports = module.imports;
            expect(imports.length).toBe(2);

            const exports = module.exports;
            expect(exports.length).toBe(3);

            const fields = module.fields;
            expect(fields.length).toBe(2);

            const functions = module.functions;
            expect(functions.length).toBe(1);

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

            const fields = module.fields;
            expect(fields.length).toBe(2);

            const functions = module.functions;
            expect(functions.length).toBe(1);

            const classes = module.classes;
            expect(classes.length).toBe(1);
        });
    });
});
