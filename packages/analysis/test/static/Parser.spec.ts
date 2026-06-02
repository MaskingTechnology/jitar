
import { describe, expect, it } from 'vitest';

import {
    ESIdentifierBinding, ESArrayBinding, ESObjectBinding, ESBindingElement,
    ESExpression,
    ESFunction, ESArrowFunction, ESGeneratorFunction,
    ESClass, ESGeneratorMethod, ESConstructor,
    ESExport,
    ESVariable
} from '../../src/model';

import { Parser } from '../../src/static';

import { VALUES, IMPORTS, EXPORTS, VARIABLES, FUNCTIONS, CLASSES, MODULES, MODULES_STRINGS } from './fixtures';

const parser = new Parser();

describe('Parser', () =>
{
    describe('Statements', () =>
    {
        it('should parse an array', () =>
        {
            const expression = parser.parseStatement(VALUES.ARRAY);
            expect(expression).toBeInstanceOf(ESExpression);
            expect(expression.toString(false)).toEqual('[1,"foo",false,new Person("Peter",42),{a:1,b:2}]');
        });

        it('should parse an object', () =>
        {
            const expression = parser.parseStatement(VALUES.OBJECT);
            expect(expression).toBeInstanceOf(ESExpression);
            expect(expression.toString(false)).toEqual('{key1:"value1","key2":new Person().toString()}');
        });

        it('should parse an expression', () =>
        {
            const expression = parser.parseStatement(VALUES.EXPRESSION);
            expect(expression).toBeInstanceOf(ESExpression);
            expect(expression.toString(false)).toEqual('new Number(Math.ceil(Math.random())+10).toString()');
        });

        it('should parse a grouped expression', () =>
        {
            const expression = parser.parseStatement(VALUES.EXPRESSION_GROUP);
            expect(expression).toBeInstanceOf(ESExpression);
            expect(expression.toString(false)).toEqual('(a+b)*c');
        });

        it('should parse an if...else expression', () =>
        {
            const expression = parser.parseStatement(VALUES.IF_ELSE);
            expect(expression).toBeInstanceOf(ESExpression);
            expect(expression.toString(false)).toEqual('if(true){return "value1";}else{return "value2";}');
        });

        it('should parse an try...catch...finally expression', () =>
        {
            const expression = parser.parseStatement(VALUES.TRY_CATCH_FINALLY);
            expect(expression).toBeInstanceOf(ESExpression);
            expect(expression.toString(false)).toEqual('try{sum(1,2);}catch(error){console.error(error);}finally{console.log("finally");}');
        });
    });

    describe('Imports', () =>
    {
        it('should parse loading a module', () =>
        {
            const imported = parser.parseImport(IMPORTS.LOAD);
            expect(imported.members).toHaveLength(0);
            expect(imported.from).toEqual('module');
        });

        it('should parse importing a single member', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT);
            expect(imported.members).toHaveLength(1);
            expect(imported.from).toEqual('module');

            const member = imported.members[0];
            expect(member.identifier).toEqual('member');
            expect(member.alias).toBeUndefined();
        });

        it('should parse importing a single member with alias', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT_AS);
            expect(imported.members).toHaveLength(1);
            expect(imported.from).toEqual('module');

            const member = imported.members[0];
            expect(member.identifier).toEqual('member');
            expect(member.alias).toEqual('alias');
        });

        it('should parse importing all members', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT_ALL);
            expect(imported.members).toHaveLength(1);
            expect(imported.from).toEqual('module');

            const member = imported.members[0];
            expect(member.identifier).toEqual('*');
            expect(member.alias).toEqual('name');
        });

        it('should parse importing the default member', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT_DEFAULT);
            expect(imported.members).toHaveLength(1);
            expect(imported.from).toEqual('module');

            const member = imported.members[0];
            expect(member.identifier).toEqual('default');
            expect(member.alias).toEqual('name');
        });

        it('should parse importing the default with another member', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT_DEFAULT_MEMBER);
            expect(imported.members).toHaveLength(2);
            expect(imported.from).toEqual('module');

            const first = imported.members[0];
            expect(first.identifier).toEqual('default');
            expect(first.alias).toEqual('name');

            const second = imported.members[1];
            expect(second.identifier).toEqual('member');
            expect(second.alias).toBeUndefined();
        });

        it('should parse importing the default with another member with alias', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT_DEFAULT_MEMBER_AS);
            expect(imported.members).toHaveLength(2);
            expect(imported.from).toEqual('module');

            const first = imported.members[0];
            expect(first.identifier).toEqual('default');
            expect(first.alias).toEqual('name');

            const second = imported.members[1];
            expect(second.identifier).toEqual('member');
            expect(second.alias).toEqual('alias');
        });

        it('should parse importing the default with other members and aliases', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT_MULTIPLE_MEMBERS_AS);
            expect(imported.members).toHaveLength(2);
            expect(imported.from).toEqual('module');

            const first = imported.members[0];
            expect(first.identifier).toEqual('name');
            expect(first.alias).toBeUndefined();

            const second = imported.members[1];
            expect(second.identifier).toEqual('member');
            expect(second.alias).toEqual('alias');
        });

        it('should parse importing modules dynamically', () =>
        {
            const imported = parser.parseImport(IMPORTS.IMPORT_DYNAMIC);
            expect(imported.members).toHaveLength(0);
            expect(imported.from).toEqual('module');
        });
    });

    describe('Exports', () =>
    {
        it('should parse exporting a single member', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT);
            expect(exported.members).toHaveLength(1);
            expect(exported.from).toBeUndefined();

            const member = exported.members[0];
            expect(member.identifier).toEqual('member');
            expect(member.alias).toBeUndefined();
        });

        it('should parse exporting a single member with alias', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT_AS);
            expect(exported.members).toHaveLength(1);
            expect(exported.from).toBeUndefined();

            const member = exported.members[0];
            expect(member.identifier).toEqual('member');
            expect(member.alias).toEqual('alias');
        });

        it('should parse exporting a default', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT_DEFAULT);
            expect(exported.members).toHaveLength(1);
            expect(exported.from).toBeUndefined();

            const member = exported.members[0];
            expect(member.identifier).toEqual('name');
            expect(member.alias).toEqual('default');
        });

        it('should parse exporting multiple members', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT_MULTIPLE);
            expect(exported.members).toHaveLength(2);
            expect(exported.from).toBeUndefined();

            const first = exported.members[0];
            expect(first.identifier).toEqual('name');
            expect(first.alias).toBeUndefined();

            const second = exported.members[1];
            expect(second.identifier).toEqual('member');
            expect(second.alias).toBeUndefined();
        });

        it('should parse exporting multiple members with alias', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT_MULTIPLE_AS);
            expect(exported.members).toHaveLength(2);
            expect(exported.from).toBeUndefined();

            const first = exported.members[0];
            expect(first.identifier).toEqual('name');
            expect(first.alias).toBeUndefined();

            const second = exported.members[1];
            expect(second.identifier).toEqual('member');
            expect(second.alias).toEqual('alias');
        });

        it('should parse exporting a class declaration', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT_CLASS_DECLARATION);
            expect(exported.members).toHaveLength(1);
            expect(exported.from).toBeUndefined();

            const member = exported.members[0];
            expect(member.identifier).toEqual('name');
            expect(member.alias).toBeUndefined();
        });

        it('should parse exporting a function declaration', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT_FUNCTION_DECLARATION);
            expect(exported.members).toHaveLength(1);
            expect(exported.from).toBeUndefined();

            const member = exported.members[0];
            expect(member.identifier).toEqual('name');
            expect(member.alias).toBeUndefined();
        });

        it('should parse exporting a field declaration', () =>
        {
            const exported = parser.parseExport(EXPORTS.EXPORT_FIELD_DECLARATION);
            expect(exported.members).toHaveLength(1);
            expect(exported.from).toBeUndefined();

            const member = exported.members[0];
            expect(member.identifier).toEqual('name');
            expect(member.alias).toBeUndefined();
        });

        it('should parse exporting a default value', () =>
        {
            const identifier = '$_EXPORT_15_17';

            const module = parser.parse(EXPORTS.EXPORT_DEFAULT_VALUE);
            expect(module.statements).toHaveLength(2);

            const exported = module.statements[0] as ESExport;
            expect(exported).toBeInstanceOf(ESExport);
            expect(exported.members).toHaveLength(1);
            expect(exported.from).toBeUndefined();

            const member = exported.members[0];
            expect(member.identifier).toEqual(identifier);
            expect(member.alias).toEqual('default');

            const declaration = module.statements[1] as ESVariable;
            expect(declaration).toBeInstanceOf(ESVariable);
            expect(declaration.type).toEqual('const');
            expect(declaration.identifier).toEqual(identifier);
            expect(declaration.initializer).toBeInstanceOf(ESExpression);
            expect(declaration.initializer?.toString(false)).toEqual('42');
        });

        it('should parse exporting a default instance', () =>
        {
            const identifier = '$_EXPORT_15_17';

            const module = parser.parse(EXPORTS.EXPORT_DEFAULT_INSTANCE);
            expect(module.statements).toHaveLength(2);

            const exported = module.statements[0] as ESExport;
            expect(exported).toBeInstanceOf(ESExport);
            expect(exported.members).toHaveLength(1);
            expect(exported.from).toBeUndefined();

            const member = exported.members[0];
            expect(member.identifier).toEqual(identifier);
            expect(member.alias).toEqual('default');

            const declaration = module.statements[1] as ESVariable;
            expect(declaration).toBeInstanceOf(ESVariable);
            expect(declaration.type).toEqual('const');
            expect(declaration.identifier).toEqual(identifier);
            expect(declaration.initializer).toBeInstanceOf(ESExpression);
            expect(declaration.initializer?.toString(false)).toEqual('new Date()');
        });

        it('should parse exporting a function call', () =>
        {
            const identifier = '$_EXPORT_15_18';

            const module = parser.parse(EXPORTS.EXPORT_DEFAULT_CALL);
            expect(module.statements).toHaveLength(2);

            const exported = module.statements[0] as ESExport;
            expect(exported).toBeInstanceOf(ESExport);
            expect(exported.members).toHaveLength(1);
            expect(exported.from).toBeUndefined();

            const member = exported.members[0];
            expect(member.identifier).toEqual(identifier);
            expect(member.alias).toEqual('default');

            const declaration = module.statements[1] as ESVariable;
            expect(declaration).toBeInstanceOf(ESVariable);
            expect(declaration.type).toEqual('const');
            expect(declaration.identifier).toEqual(identifier);
            expect(declaration.initializer).toBeInstanceOf(ESExpression);
            expect(declaration.initializer?.toString(false)).toEqual('name()');
        });

        it('should parse exporting a default function', () =>
        {
            const module = parser.parse(EXPORTS.EXPORT_DEFAULT_FUNCTION);
            expect(module.statements).toHaveLength(2);

            const exported = module.statements[0] as ESExport;
            expect(exported).toBeInstanceOf(ESExport);
            expect(exported.members).toHaveLength(1);
            expect(exported.from).toBeUndefined();

            const member = exported.members[0];
            expect(member.identifier).toEqual('');
            expect(member.alias).toEqual('default');

            const declaration = module.statements[1] as ESFunction;
            expect(declaration).toBeInstanceOf(ESFunction);
        });

        it('should parse exporting a default class', () =>
        {
            const module = parser.parse(EXPORTS.EXPORT_DEFAULT_CLASS);
            expect(module.statements).toHaveLength(2);

            const exported = module.statements[0] as ESExport;
            expect(exported).toBeInstanceOf(ESExport);
            expect(exported.members).toHaveLength(1);
            expect(exported.from).toBeUndefined();

            const member = exported.members[0];
            expect(member.identifier).toEqual('');
            expect(member.alias).toEqual('default');

            const declaration = module.statements[1] as ESClass;
            expect(declaration).toBeInstanceOf(ESClass);
        });

        it('should parse reexporting a module', () =>
        {
            const exported = parser.parseExport(EXPORTS.REEXPORT_ALL);
            expect(exported.members).toHaveLength(1);
            expect(exported.from).toEqual('module');

            const member = exported.members[0];
            expect(member.identifier).toEqual('');
            expect(member.alias).toBeUndefined();
        });

        it('should parse reexporting a member', () =>
        {
            const exported = parser.parseExport(EXPORTS.REEXPORT_MEMBER);
            expect(exported.members).toHaveLength(1);
            expect(exported.from).toEqual('module');

            const member = exported.members[0];
            expect(member.identifier).toEqual('member');
            expect(member.alias).toBeUndefined();
        });
    });

    describe('Variables', () =>
    {
        it('should parse an empty declaration', () =>
        {
            const variable = parser.parseVariable(VARIABLES.EMPTY);
            expect(variable.identifier).toEqual('name');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toEqual('let');
            expect(variable.initializer).toBeUndefined();
        });

        it('should parse a const variable', () =>
        {
            const variable = parser.parseVariable(VARIABLES.CONST);
            expect(variable.identifier).toEqual('name');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toEqual('const');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString(false)).toEqual("'const'");
        });

        it('should parse a let declaration with value', () =>
        {
            const variable = parser.parseVariable(VARIABLES.LET);
            expect(variable.identifier).toEqual('name');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toEqual('let');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString(false)).toEqual("'let'");
        });

        it('should parse a var declaration with value', () =>
        {
            const variable = parser.parseVariable(VARIABLES.VAR);
            expect(variable.identifier).toEqual('name');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toEqual('var');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString(false)).toEqual("'var'");
        });

        it('should parse a declaration with multiple declarations', () =>
        {
            const variable = parser.parseVariable(VARIABLES.MULTIPLE);
            expect(variable.identifier).toEqual('name1');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toEqual('let');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString(false)).toEqual('(1+2)*3');
        });

        it('should parse a declaration with an expression', () =>
        {
            const variable = parser.parseVariable(VARIABLES.EXPRESSION);
            expect(variable.identifier).toEqual('number');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toEqual('const');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString(false)).toEqual('new Number(Math.ceil(Math.random())+10).toString()');
        });

        it('should parse a declaration with an array value', () =>
        {
            const variable = parser.parseVariable(VARIABLES.ARRAY);
            expect(variable.identifier).toEqual('array');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toEqual('const');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString(false)).toEqual("['value1','value2']");
        });

        it('should parse a declaration with an object value', () =>
        {
            const variable = parser.parseVariable(VARIABLES.OBJECT);
            expect(variable.identifier).toEqual('object');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toEqual('const');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString(false)).toEqual("{key1:'value1',key2:'value2'}");
        });

        it('should parse a declaration with a regex value', () =>
        {
            const variable = parser.parseVariable(VARIABLES.REGEX);
            expect(variable.identifier).toEqual('regex');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toEqual('const');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString(false)).toEqual("/regex/g");
        });

        it('should parse a declaration that is destructuring an array', () =>
        {
            const variable = parser.parseVariable(VARIABLES.DESTRUCTURING_ARRAY);
            expect(variable.identifier).toEqual('[value1,value2=true]');
            expect(variable.binding).toBeInstanceOf(ESArrayBinding);
            expect(variable.type).toEqual('const');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString(false)).toEqual('array');

            const binding = variable.binding as ESArrayBinding;
            expect(binding.elements).toHaveLength(2);
            
            const firstElement = binding.elements[0];
            expect(firstElement).toBeInstanceOf(ESBindingElement);
            expect(firstElement.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(firstElement.binding.toString()).toEqual('value1');
            expect(firstElement.initializer).toBeUndefined();

            const secondElement = binding.elements[1];
            expect(secondElement).toBeInstanceOf(ESBindingElement);
            expect(secondElement.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(secondElement.binding.toString()).toEqual('value2');
            expect(secondElement.initializer).toBeInstanceOf(ESExpression);
            expect(secondElement.initializer?.toString(false)).toEqual('true');
        });

        it('should parse a declaration that is destructuring an object', () =>
        {
            const variable = parser.parseVariable(VARIABLES.DESTRUCTURING_OBJECT);
            expect(variable.identifier).toEqual('{key1,key2=false}');
            expect(variable.binding).toBeInstanceOf(ESObjectBinding);
            expect(variable.type).toEqual('const');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString(false)).toEqual('object');

            const binding = variable.binding as ESObjectBinding;
            expect(binding.elements).toHaveLength(2);

            const firstElement = binding.elements[0];
            expect(firstElement.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(firstElement.binding.toString()).toEqual('key1');
            expect(firstElement.initializer).toBeUndefined();

            const secondElement = binding.elements[1];
            expect(secondElement).toBeInstanceOf(ESBindingElement);
            expect(secondElement.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(secondElement.binding.toString()).toEqual('key2');
            expect(secondElement.initializer).toBeInstanceOf(ESExpression);
            expect(secondElement.initializer?.toString(false)).toEqual('false');
        });

        it('should parse a declaration with a non reserved keyword as name', () =>
        {
            const variable = parser.parseVariable(VARIABLES.KEYWORD_AS_NAME);
            expect(variable.identifier).toEqual('as');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toEqual('const');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString(false)).toEqual("'value'");
        });

        it('should parse a declaration that refers to a non reserved keyword as value', () =>
        {
            const variable = parser.parseVariable(VARIABLES.KEYWORD_AS_VALUE);
            expect(variable.identifier).toEqual('alias');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toEqual('const');
            expect(variable.initializer).toBeInstanceOf(ESExpression);
            expect(variable.initializer?.toString(false)).toEqual(' as ');
        });
    });

    describe('Functions', () =>
    {
        it('should parse a simple function declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.DECLARATION);
            expect(funktion.identifier).toEqual('name');
            expect(funktion.isAsync).toBeFalsy();
            expect(funktion.parameters).toHaveLength(0);
            expect(funktion.body.toString()).toEqual('{}');
        });

        it('should parse an async function declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.ASYNC_DECLARATION);
            expect(funktion.identifier).toEqual('name');
            expect(funktion.isAsync).toBeTruthy();
            expect(funktion.parameters).toHaveLength(0);
            expect(funktion.body.toString()).toEqual('{}');
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
            expect(funktion.isAsync).toBeFalsy();
            expect(funktion.parameters).toHaveLength(0);
            expect(funktion.body.toString()).toEqual('{}');
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
            expect(funktion.isAsync).toBeTruthy();
            expect(funktion.parameters).toHaveLength(0);
            expect(funktion.body.toString()).toEqual('{}');
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
            expect(funktion.isAsync).toBeFalsy();
            expect(funktion.parameters).toHaveLength(0);
            expect(funktion.body.toString()).toEqual('{}');
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
            expect(funktion.isAsync).toBeFalsy();
            expect(funktion.parameters).toHaveLength(0);
            expect(funktion.body.toString()).toEqual("'value'");
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
            expect(funktion.isAsync).toBeFalsy();
            expect(funktion.parameters).toHaveLength(1);
            expect(funktion.body.toString()).toEqual('arg');
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
            expect(funktion.isAsync).toBeTruthy();
            expect(funktion.parameters).toHaveLength(0);
            expect(funktion.body.toString()).toEqual('{}');
        });

        it('should parse a generator function declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.GENERATOR);
            expect(funktion).toBeInstanceOf(ESGeneratorFunction);
            expect(funktion.identifier).toEqual('name');
            expect(funktion.isAsync).toBeFalsy();
            expect(funktion.parameters).toHaveLength(0);
            expect(funktion.body.toString()).toEqual('{}');
        });

        it('should parse an async generator function declaration', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.ASYNC_GENERATOR);
            expect(funktion).toBeInstanceOf(ESGeneratorFunction);
            expect(funktion.identifier).toEqual('name');
            expect(funktion.isAsync).toBeTruthy();
            expect(funktion.parameters).toHaveLength(0);
            expect(funktion.body.toString()).toEqual('{}');
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
            expect(funktion.isAsync).toBeFalsy();
            expect(funktion.parameters).toHaveLength(0);
            expect(funktion.body.toString()).toEqual('{}');
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
            expect(funktion.isAsync).toBeTruthy();
            expect(funktion.parameters).toHaveLength(0);
            expect(funktion.body.toString()).toEqual('{}');
        });

        it('should parse a function with parameters', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.PARAMETERS);
            expect(funktion.identifier).toEqual('name');
            expect(funktion.isAsync).toBeFalsy();
            expect(funktion.body.toString()).toEqual('{}');

            const parameters = funktion.parameters;
            expect(parameters).toHaveLength(2);

            const first = parameters[0];
            expect(first.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(first.binding.toString()).toEqual('param1');
            expect(first.initializer).toBeUndefined();

            const second = parameters[1];
            expect(second.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(second.binding.toString()).toEqual('param2');
            expect(second.initializer).toBeUndefined();
        });

        it('should parse a function with default parameters', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.DEFAULT_PARAMETERS);
            expect(funktion.identifier).toEqual('name');
            expect(funktion.isAsync).toBeFalsy();
            expect(funktion.body.toString()).toEqual('{}');

            const parameters = funktion.parameters;
            expect(parameters).toHaveLength(2);

            const first = parameters[0];
            expect(first.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(first.binding.toString()).toEqual('param1');
            expect(first.initializer).toBeInstanceOf(ESExpression);
            expect(first.initializer?.toString(false)).toEqual("'value1'");

            const second = parameters[1];
            expect(second.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(second.binding.toString()).toEqual('param2');
            expect(second.initializer).toBeInstanceOf(ESExpression);
            expect(second.initializer?.toString(false)).toEqual('true');
        });

        it('should parse a function with a rest parameter', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.REST_PARAMETERS);
            expect(funktion.identifier).toEqual('name');
            expect(funktion.isAsync).toBeFalsy();
            expect(funktion.body.toString()).toEqual('{}');

            const parameters = funktion.parameters;
            expect(parameters).toHaveLength(1);

            const first = parameters[0];
            expect(first.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(first.binding.toString()).toEqual('...param1');
            expect(first.initializer).toBeUndefined();
        });

        it('should parse a function with destructuring parameters', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.DESTRUCTURING_PARAMETERS);
            expect(funktion.identifier).toEqual('name');
            expect(funktion.isAsync).toBeFalsy();
            expect(funktion.body.toString()).toEqual('{}');

            const parameters = funktion.parameters;
            expect(parameters).toHaveLength(2);

            const firstParameter = parameters[0];
            expect(firstParameter.binding).toBeInstanceOf(ESObjectBinding);
            expect(firstParameter.initializer).toBeUndefined();

            const firstBinding = firstParameter.binding as ESObjectBinding;
            expect(firstBinding.elements).toHaveLength(2);
            expect(firstBinding.toString()).toEqual('{param1,param2}');

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

            const secondBinding = secondParameter.binding as ESArrayBinding;
            expect(secondBinding.elements).toHaveLength(2);
            expect(secondBinding.toString()).toEqual('[param3,param4]');

            const thirdMember = secondBinding.elements[0];
            expect(thirdMember.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(thirdMember.binding.toString()).toEqual('param3');
            expect(thirdMember.initializer).toBeUndefined();

            const fourthMember = secondBinding.elements[1];
            expect(fourthMember.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(fourthMember.binding.toString()).toEqual('param4');
            expect(fourthMember.initializer).toBeUndefined();
        });

        it('should parse a function with destructuring default parameters', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.DESTRUCTURING_DEFAULT_PARAMETERS);
            expect(funktion.identifier).toEqual('name');
            expect(funktion.isAsync).toBeFalsy();
            expect(funktion.body.toString()).toEqual('{}');

            const parameters = funktion.parameters;
            expect(parameters).toHaveLength(2);

            const firstParameter = parameters[0];
            expect(firstParameter.binding).toBeInstanceOf(ESObjectBinding);
            expect(firstParameter.initializer).toBeUndefined();

            const firstBinding = firstParameter.binding as ESObjectBinding;
            expect(firstBinding.elements).toHaveLength(2);
            expect(firstBinding.toString()).toEqual("{param1='value1',param2=true}");

            const firstMember = firstBinding.elements[0];
            expect(firstMember.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(firstMember.binding.toString()).toEqual('param1');
            expect(firstMember.initializer).toBeInstanceOf(ESExpression);

            const secondMember = firstBinding.elements[1];
            expect(secondMember.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(secondMember.binding.toString()).toEqual('param2');
            expect(secondMember.initializer).toBeInstanceOf(ESExpression);

            const secondParameter = parameters[1];
            expect(secondParameter.binding).toBeInstanceOf(ESArrayBinding);
            expect(secondParameter.initializer).toBeUndefined();

            const secondBinding = secondParameter.binding as ESArrayBinding;
            expect(secondBinding.elements).toHaveLength(2);
            expect(secondBinding.toString()).toEqual("[param3='value3',param4=true]");

            const thirdMember = secondBinding.elements[0];
            expect(thirdMember.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(thirdMember.binding.toString()).toEqual('param3');
            expect(thirdMember.initializer).toBeInstanceOf(ESExpression);

            const fourthMember = secondBinding.elements[1];
            expect(fourthMember.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(fourthMember.binding.toString()).toEqual('param4');
            expect(fourthMember.initializer).toBeInstanceOf(ESExpression);
        });

        it('should parse a function with destructuring rest parameters', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.DESTRUCTURING_REST_PARAMETERS);
            expect(funktion.identifier).toEqual('name');
            expect(funktion.isAsync).toBeFalsy();
            expect(funktion.body.toString()).toEqual('{}');

            const parameters = funktion.parameters;
            expect(parameters).toHaveLength(2);

            const firstParameter = parameters[0];
            expect(firstParameter.binding).toBeInstanceOf(ESObjectBinding);
            expect(firstParameter.initializer).toBeUndefined();

            const firstBinding = firstParameter.binding as ESObjectBinding;
            expect(firstBinding.elements).toHaveLength(2);
            expect(firstBinding.toString()).toEqual('{param1,param2}');

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

            const secondBinding = secondParameter.binding as ESArrayBinding;
            expect(secondBinding.elements).toHaveLength(2);
            expect(secondBinding.toString()).toEqual('[param3,...param4]');

            const thirdMember = secondBinding.elements[0];
            expect(thirdMember.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(thirdMember.binding.toString()).toEqual('param3');
            expect(thirdMember.initializer).toBeUndefined();

            const fourthMember = secondBinding.elements[1];
            expect(fourthMember.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(fourthMember.binding.toString()).toEqual('...param4');
            expect(fourthMember.initializer).toBeUndefined();
        });

        it('should parse a simple function body', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.SIMPLE_BODY);

            expect(funktion.identifier).toEqual('name');
            expect(funktion.isAsync).toBeFalsy();
            expect(funktion.body.toString()).toEqual("{return 'value';}");

            const parameters = funktion.parameters;
            expect(parameters).toHaveLength(0);
        });

        it('should parse a block function body', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.BLOCK_BODY);

            expect(funktion.identifier).toEqual('name');
            expect(funktion.isAsync).toBeFalsy();
            expect(funktion.body.toString()).toEqual("{if(true){return 'value';}}");

            const parameters = funktion.parameters;
            expect(parameters).toHaveLength(0);
        });

        it('should parse function with a non reserved keyword as name', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.KEYWORD_AS_NAME);

            expect(funktion.identifier).toEqual('as');
            expect(funktion.isAsync).toBeFalsy();
            expect(funktion.body.toString()).toEqual("{}");

            const parameters = funktion.parameters;
            expect(parameters).toHaveLength(0);
        });
    });

    describe('Classes', () =>
    {
        it('should parse a simple class declaration', () =>
        {
            const clazz = parser.parseClass(CLASSES.DECLARATION);
            expect(clazz.identifier).toEqual('Name');
            expect(clazz.parent).toBeUndefined();

            const members = clazz.members;
            expect(members).toHaveLength(0);
        });

        it('should parse a simple class declaration with parent class', () =>
        {
            const clazz = parser.parseClass(CLASSES.EXTENDS);
            expect(clazz.identifier).toEqual('Name');
            expect(clazz.parent).toEqual('Parent');
            
            const members = clazz.members;
            expect(members).toHaveLength(0);
        });

        it('should parse an expression class declaration', () =>
        {
            const variable = parser.parseVariable(CLASSES.EXPRESSION);
            expect(variable.identifier).toEqual('name');
            expect(variable.binding).toBeInstanceOf(ESIdentifierBinding);
            expect(variable.type).toEqual('const');
            expect(variable.initializer).toBeInstanceOf(ESClass);

            const clazz = variable.initializer as ESClass;
            expect(clazz.identifier).toBeUndefined();
            expect(clazz.parent).toBeUndefined();

            const members = clazz.members;
            expect(members).toHaveLength(0);
        });

        it('should parse class members', () =>
        {
            const clazz = parser.parseClass(CLASSES.MEMBERS);
            expect(clazz.identifier).toEqual('Name');
            expect(clazz.parent).toBeUndefined();

            const members = clazz.members;
            expect(members).toHaveLength(21);

            const fields = clazz.fields;
            expect(fields).toHaveLength(4);

            expect(fields[0].identifier).toEqual('field1');
            expect(fields[0].visibility).toEqual('private');
            expect(fields[0].location).toEqual('instance');
            expect(fields[0].initializer?.toString(false)).toEqual("'value1'");

            expect(fields[1].identifier).toEqual('field2');
            expect(fields[1].visibility).toEqual('public');
            expect(fields[1].location).toEqual('instance');
            expect(fields[1].initializer).toBeUndefined();

            expect(fields[2].identifier).toEqual('field3');
            expect(fields[2].visibility).toEqual('private');
            expect(fields[2].location).toEqual('static');
            expect(fields[2].initializer?.toString(false)).toEqual('"value3"');

            expect(fields[3].identifier).toEqual('field4');
            expect(fields[3].visibility).toEqual('public');
            expect(fields[3].location).toEqual('static');
            expect(fields[3].initializer).toBeUndefined();

            const getters = clazz.getters;
            expect(getters).toHaveLength(4);

            expect(getters[0].identifier).toEqual('getter1');
            expect(getters[0].visibility).toEqual('private');
            expect(getters[0].location).toEqual('instance');
            expect(getters[0].body.code).toEqual('{return this.#field1;}');

            expect(getters[1].identifier).toEqual('getter2');
            expect(getters[1].visibility).toEqual('public');
            expect(getters[1].location).toEqual('instance');
            expect(getters[1].body.code).toEqual('{return this.field2;}');

            expect(getters[2].identifier).toEqual('getter3');
            expect(getters[2].visibility).toEqual('private');
            expect(getters[2].location).toEqual('static');
            expect(getters[2].body.code).toEqual('{return this.#field3;}');

            expect(getters[3].identifier).toEqual('getter4');
            expect(getters[3].visibility).toEqual('public');
            expect(getters[3].location).toEqual('static');
            expect(getters[3].body.code).toEqual('{return this.field4;}');

            const setters = clazz.setters;
            expect(setters).toHaveLength(4);

            expect(setters[0].identifier).toEqual('setter1');
            expect(setters[0].visibility).toEqual('private');
            expect(setters[0].location).toEqual('instance');
            expect(setters[0].parameter.binding.toString()).toEqual('value');
            expect(setters[0].body.code).toEqual('{this.#field1=value;}');

            expect(setters[1].identifier).toEqual('setter2');
            expect(setters[1].visibility).toEqual('public');
            expect(setters[1].location).toEqual('instance');
            expect(setters[1].parameter.binding.toString()).toEqual('value');
            expect(setters[1].body.code).toEqual('{this.field2=value;}');

            expect(setters[2].identifier).toEqual('setter3');
            expect(setters[2].visibility).toEqual('private');
            expect(setters[2].location).toEqual('static');
            expect(setters[2].parameter.binding.toString()).toEqual('value');
            expect(setters[2].body.code).toEqual('{this.#field3=value;}');

            expect(setters[3].identifier).toEqual('setter4');
            expect(setters[3].visibility).toEqual('public');
            expect(setters[3].location).toEqual('static');
            expect(setters[3].parameter.binding.toString()).toEqual('value');
            expect(setters[3].body.code).toEqual('{this.field4=value;}');

            const construct = clazz.construct as ESConstructor;
            expect(construct).toBeDefined();
            expect(construct.identifier).toEqual('constructor');
            expect(construct.visibility).toEqual('public');
            expect(construct.location).toEqual('instance');
            expect(construct.parameters).toHaveLength(2);
            expect(construct.parameters[0].toString()).toEqual('field1');
            expect(construct.parameters[1].toString()).toEqual('...field2');
            expect(construct.body.toString()).toEqual('{this.#field1=field1;this.field2=field2;}');

            const methods = clazz.methods;
            expect(methods).toHaveLength(8);

            expect(methods[0].identifier).toEqual('method1');
            expect(methods[0].visibility).toEqual('public');
            expect(methods[0].location).toEqual('instance');
            expect(methods[0].isAsync).toBeFalsy();
            expect(methods[0].parameters).toHaveLength(0);
            expect(methods[0].body.toString()).toEqual('{return this.#field1;}');

            expect(methods[1].identifier).toEqual('method2');
            expect(methods[1].visibility).toEqual('public');
            expect(methods[1].location).toEqual('instance');
            expect(methods[1].isAsync).toBeTruthy();
            expect(methods[1].parameters).toHaveLength(0);
            expect(methods[1].body.toString()).toEqual('{return this.field2;}');

            expect(methods[2].identifier).toEqual('method3');
            expect(methods[2].visibility).toEqual('public');
            expect(methods[2].location).toEqual('static');
            expect(methods[2].isAsync).toBeFalsy();
            expect(methods[2].parameters).toHaveLength(0);
            expect(methods[2].body.toString()).toEqual('{return this.#field3;}');

            expect(methods[3].identifier).toEqual('method4');
            expect(methods[3].visibility).toEqual('public');
            expect(methods[3].location).toEqual('static');
            expect(methods[3].isAsync).toBeTruthy();
            expect(methods[3].parameters).toHaveLength(0);
            expect(methods[3].body.toString()).toEqual('{return this.field4;}');

            expect(methods[4].identifier).toEqual('method5');
            expect(methods[4].visibility).toEqual('private');
            expect(methods[4].location).toEqual('instance');
            expect(methods[4].isAsync).toBeFalsy();
            expect(methods[4].parameters).toHaveLength(2);
            expect(methods[4].parameters[0].toString()).toEqual('a');
            expect(methods[4].parameters[1].toString()).toEqual('b');
            expect(methods[4].body.toString()).toEqual('{return a+b;}');

            expect(methods[5]).toBeInstanceOf(ESGeneratorMethod);
            expect(methods[5].identifier).toEqual('generator1');
            expect(methods[5].visibility).toEqual('public');
            expect(methods[5].location).toEqual('instance');
            expect(methods[5].isAsync).toBeFalsy();
            expect(methods[5].parameters).toHaveLength(0);
            expect(methods[5].body.toString()).toEqual('{yield 1;}');

            expect(methods[6]).toBeInstanceOf(ESGeneratorMethod);
            expect(methods[6].identifier).toEqual('generator2');
            expect(methods[6].visibility).toEqual('public');
            expect(methods[6].location).toEqual('instance');
            expect(methods[6].isAsync).toBeTruthy();
            expect(methods[6].parameters).toHaveLength(0);
            expect(methods[6].body.toString()).toEqual('{yield 1;}');

            expect(methods[7]).toBeInstanceOf(ESGeneratorMethod);
            expect(methods[7].identifier).toEqual('generator3');
            expect(methods[7].visibility).toEqual('public');
            expect(methods[7].location).toEqual('static');
            expect(methods[7].isAsync).toBeTruthy();
            expect(methods[7].parameters).toHaveLength(0);
            expect(methods[7].body.toString()).toEqual('{yield 1;}');
        });
    });

    describe('Modules', () =>
    {
        it('should parse an empty module', () =>
        {
            const module = parser.parse('');
            expect(module.statements).toHaveLength(0);
        });

        it('should parse a module with terminated statements', () =>
        {
            const module = parser.parse(MODULES.TERMINATED);
            expect(module.statements).toHaveLength(16);
            expect(module.imports).toHaveLength(2);
            expect(module.exports).toHaveLength(4);
            expect(module.expressions).toHaveLength(2);
            expect(module.variables).toHaveLength(5);
            expect(module.functions).toHaveLength(2);
            expect(module.classes).toHaveLength(1);
            expect(module.toString()).toEqual(MODULES_STRINGS.TERMINATED);
        });

        it('should parse a module with unterminated statements', () =>
        {
            const module = parser.parse(MODULES.UNTERMINATED);
            expect(module.statements).toHaveLength(10);
            expect(module.imports).toHaveLength(2);
            expect(module.exports).toHaveLength(3);
            expect(module.expressions).toHaveLength(1);
            expect(module.variables).toHaveLength(2);
            expect(module.functions).toHaveLength(1);
            expect(module.classes).toHaveLength(1);
            // NOTE: Unterminated code is read only as it can not be outputted to working code
        });
    });
});
