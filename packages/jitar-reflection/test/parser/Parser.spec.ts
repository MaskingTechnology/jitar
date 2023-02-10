
import Parser from '../../src/parser/Parser';
import ReflectionImport from '../../src/models/ReflectionImport';

import { IMPORTS, EXPORTS, FIELDS, FUNCTIONS, CLASSES } from '../_fixtures/parser/Parser.fixture';

const parser = new Parser();

describe('parser/Parser', () =>
{
    describe('.parseModule(code)', () =>
    {
        it('should parse loading a module', () =>
        {
            const module = parser.parseModule(IMPORTS.LOAD);

            expect(module.imports.length).toBe(1);

            const imported = module.imports[0];

            expect(imported.name).toBe('');
            expect(imported.as).toBe('');
            expect(imported.from).toBe("'module'");
        });

        it('should parse importing a single member', () =>
        {
            const module = parser.parseModule(IMPORTS.IMPORT);

            expect(module.imports.length).toBe(1);

            const imported = module.imports[0];

            expect(imported.name).toBe('member');
            expect(imported.as).toBe('member');
            expect(imported.from).toBe("'module'");
        });

        it('should parse importing a single member with alias', () =>
        {
            const module = parser.parseModule(IMPORTS.IMPORT_AS);

            expect(module.imports.length).toBe(1);

            const imported = module.imports[0];

            expect(imported.name).toBe('member');
            expect(imported.as).toBe('alias');
            expect(imported.from).toBe("'module'");
        });

        it('should parse importing all members', () =>
        {
            const module = parser.parseModule(IMPORTS.IMPORT_ALL);

            expect(module.imports.length).toBe(1);

            const imported = module.imports[0];

            expect(imported.name).toBe('default');
            expect(imported.as).toBe('name');
            expect(imported.from).toBe("'module'");
        });

        it('should parse importing the default member', () =>
        {
            const module = parser.parseModule(IMPORTS.IMPORT_DEFAULT);

            expect(module.imports.length).toBe(1);

            const imported = module.imports[0];

            expect(imported.name).toBe('default');
            expect(imported.as).toBe('name');
            expect(imported.from).toBe("'module'");
        });

        it('should parse importing the default with another member', () =>
        {
            const module = parser.parseModule(IMPORTS.IMPORT_DEFAULT_MEMBER);

            expect(module.imports.length).toBe(2);

            const first = module.imports[0];

            expect(first.name).toBe('default');
            expect(first.as).toBe('name');
            expect(first.from).toBe("'module'");

            const second = module.imports[1];

            expect(second.name).toBe('member');
            expect(second.as).toBe('member');
            expect(second.from).toBe("'module'");
        });

        it('should parse importing the default with another member with alias', () =>
        {
            const module = parser.parseModule(IMPORTS.IMPORT_DEFAULT_MEMBER_AS);

            expect(module.imports.length).toBe(2);

            const first = module.imports[0];

            expect(first.name).toBe('default');
            expect(first.as).toBe('name');
            expect(first.from).toBe("'module'");

            const second = module.imports[1];

            expect(second.name).toBe('member');
            expect(second.as).toBe('alias');
            expect(second.from).toBe("'module'");
        });

        it('should parse importing the default with other members and aliases', () =>
        {
            const module = parser.parseModule(IMPORTS.IMPORT_MULTIPLE_MEMBERS_AS);

            expect(module.imports.length).toBe(2);

            const first = module.imports[0];

            expect(first.name).toBe('name');
            expect(first.as).toBe('name');
            expect(first.from).toBe("'module'");

            const second = module.imports[1];

            expect(second.name).toBe('member');
            expect(second.as).toBe('alias');
            expect(second.from).toBe("'module'");
        });

        it('should parse exporting a single member', () =>
        {
            const module = parser.parseModule(EXPORTS.EXPORT);

            expect(module.exports.length).toBe(1);

            const exported = module.exports[0];

            expect(exported.name).toBe('member');
            expect(exported.as).toBe('member');
            expect(exported.from).toBe(undefined);
        });

        it('should parse exporting a single member with alias', () =>
        {
            const module = parser.parseModule(EXPORTS.EXPORT_AS);

            expect(module.exports.length).toBe(1);

            const exported = module.exports[0];

            expect(exported.name).toBe('member');
            expect(exported.as).toBe('alias');
            expect(exported.from).toBe(undefined);
        });

        it('should parse exporting a default', () =>
        {
            const module = parser.parseModule(EXPORTS.EXPORT_DEFAULT);

            expect(module.exports.length).toBe(1);

            const exported = module.exports[0];

            expect(exported.name).toBe('name');
            expect(exported.as).toBe('default');
            expect(exported.from).toBe(undefined);
        });

        it('should parse exporting multiple members', () =>
        {
            const module = parser.parseModule(EXPORTS.EXPORT_MULTIPLE);

            expect(module.exports.length).toBe(2);

            const first = module.exports[0];

            expect(first.name).toBe('name');
            expect(first.as).toBe('name');
            expect(first.from).toBe(undefined);

            const second = module.exports[1];

            expect(second.name).toBe('member');
            expect(second.as).toBe('member');
            expect(second.from).toBe(undefined);
        });

        it('should parse exporting multiple members with alias', () =>
        {
            const module = parser.parseModule(EXPORTS.EXPORT_MULTIPLE_AS);

            expect(module.exports.length).toBe(2);

            const first = module.exports[0];

            expect(first.name).toBe('name');
            expect(first.as).toBe('name');
            expect(first.from).toBe(undefined);

            const second = module.exports[1];

            expect(second.name).toBe('member');
            expect(second.as).toBe('alias');
            expect(second.from).toBe(undefined);
        });

        it('should parse exporting a class declaration', () =>
        {
            const module = parser.parseModule(EXPORTS.EXPORT_CLASS_DECLARATION);

            expect(module.exports.length).toBe(1);

            const exported = module.exports[0];

            expect(exported.name).toBe('name');
            expect(exported.as).toBe('name');
            expect(exported.from).toBe(undefined);
        });

        it('should parse exporting a function declaration', () =>
        {
            const module = parser.parseModule(EXPORTS.EXPORT_FUNCTION_DECLARATION);

            expect(module.exports.length).toBe(1);

            const exported = module.exports[0];

            expect(exported.name).toBe('name');
            expect(exported.as).toBe('name');
            expect(exported.from).toBe(undefined);
        });

        it('should parse exporting a async function declaration', () =>
        {
            const module = parser.parseModule(EXPORTS.EXPORT_ASYNC_FUNCTION_DECLARATION);

            expect(module.exports.length).toBe(1);

            const exported = module.exports[0];

            expect(exported.name).toBe('name');
            expect(exported.as).toBe('name');
            expect(exported.from).toBe(undefined);
        });

        it('should parse reexporting a module', () =>
        {
            const module = parser.parseModule(EXPORTS.REEXPORT_ALL);

            expect(module.exports.length).toBe(1);

            const exported = module.exports[0];

            expect(exported.name).toBe('(anonymous)');
            expect(exported.as).toBe('(anonymous)');
            expect(exported.from).toBe("'module'");
        });

        it('should parse reexporting a member', () =>
        {
            const module = parser.parseModule(EXPORTS.REEXPORT_MEMBER);

            expect(module.exports.length).toBe(1);

            const exported = module.exports[0];

            expect(exported.name).toBe('member');
            expect(exported.as).toBe('member');
            expect(exported.from).toBe("'module'");
        });
    });

    describe('.parseClass(code)', () =>
    {
        it('should parse a simple class declaration', () =>
        {
            const clazz = parser.parseClass(CLASSES.DECLARATION);

            expect(clazz.name).toBe('Name');
            expect(clazz.parentName).toBe(undefined);
            expect(clazz.members.length).toBe(0);
        });

        it('should parse a simple class declaration with parent class', () =>
        {
            const clazz = parser.parseClass(CLASSES.EXTENDS);

            expect(clazz.name).toBe('Name');
            expect(clazz.parentName).toBe('Parent');
            expect(clazz.members.length).toBe(0);
        });

        it('should parse class members', () =>
        {
            const clazz = parser.parseClass(CLASSES.MEMBERS);

            expect(clazz.name).toBe('Name');
            expect(clazz.parentName).toBe(undefined);

            expect(clazz.fields.length).toBe(4);

            expect(clazz.fields[0].name).toBe('field1');
            expect(clazz.fields[0].isPrivate).toBe(true);
            expect(clazz.fields[0].isStatic).toBe(false);
            expect(clazz.fields[0].value).toBe("'value1'");

            expect(clazz.fields[1].name).toBe('field2');
            expect(clazz.fields[1].isPrivate).toBe(false);
            expect(clazz.fields[1].isStatic).toBe(false);
            expect(clazz.fields[1].value).toBe(undefined);

            expect(clazz.fields[2].name).toBe('field3');
            expect(clazz.fields[2].isPrivate).toBe(true);
            expect(clazz.fields[2].isStatic).toBe(true);
            expect(clazz.fields[2].value).toBe('"value3"');

            expect(clazz.fields[3].name).toBe('field4');
            expect(clazz.fields[3].isPrivate).toBe(false);
            expect(clazz.fields[3].isStatic).toBe(true);
            expect(clazz.fields[3].value).toBe(undefined);

            expect(clazz.getters.length).toBe(4);

            expect(clazz.getters[0].name).toBe('getter1');
            expect(clazz.getters[0].isPrivate).toBe(true);
            expect(clazz.getters[0].isStatic).toBe(false);

            expect(clazz.getters[1].name).toBe('getter2');
            expect(clazz.getters[1].isPrivate).toBe(false);
            expect(clazz.getters[1].isStatic).toBe(false);

            expect(clazz.getters[2].name).toBe('getter3');
            expect(clazz.getters[2].isPrivate).toBe(true);
            expect(clazz.getters[2].isStatic).toBe(true);

            expect(clazz.getters[3].name).toBe('getter4');
            expect(clazz.getters[3].isPrivate).toBe(false);
            expect(clazz.getters[3].isStatic).toBe(true);

            expect(clazz.setters.length).toBe(4);

            expect(clazz.setters[0].name).toBe('setter1');
            expect(clazz.setters[0].isPrivate).toBe(true);
            expect(clazz.setters[0].isStatic).toBe(false);

            expect(clazz.setters[1].name).toBe('setter2');
            expect(clazz.setters[1].isPrivate).toBe(false);
            expect(clazz.setters[1].isStatic).toBe(false);

            expect(clazz.setters[2].name).toBe('setter3');
            expect(clazz.setters[2].isPrivate).toBe(true);
            expect(clazz.setters[2].isStatic).toBe(true);

            expect(clazz.setters[3].name).toBe('setter4');
            expect(clazz.setters[3].isPrivate).toBe(false);
            expect(clazz.setters[3].isStatic).toBe(true);

            expect(clazz.functions.length).toBe(6);

            expect(clazz.functions[0].name).toBe('constructor');
            expect(clazz.functions[0].isPrivate).toBe(false);
            expect(clazz.functions[0].isStatic).toBe(false);
            expect(clazz.functions[0].isAsync).toBe(false);

            expect(clazz.functions[1].name).toBe('method1');
            expect(clazz.functions[1].isPrivate).toBe(false);
            expect(clazz.functions[1].isStatic).toBe(false);
            expect(clazz.functions[1].isAsync).toBe(false);

            expect(clazz.functions[2].name).toBe('method2');
            expect(clazz.functions[2].isPrivate).toBe(false);
            expect(clazz.functions[2].isStatic).toBe(false);
            expect(clazz.functions[2].isAsync).toBe(true);

            expect(clazz.functions[3].name).toBe('method3');
            expect(clazz.functions[3].isPrivate).toBe(false);
            expect(clazz.functions[3].isStatic).toBe(true);
            expect(clazz.functions[3].isAsync).toBe(false);

            expect(clazz.functions[4].name).toBe('method4');
            expect(clazz.functions[4].isPrivate).toBe(false);
            expect(clazz.functions[4].isStatic).toBe(true);
            expect(clazz.functions[4].isAsync).toBe(true);

            expect(clazz.functions[5].name).toBe('method5');
            expect(clazz.functions[5].isPrivate).toBe(true);
            expect(clazz.functions[5].isStatic).toBe(false);
            expect(clazz.functions[5].isAsync).toBe(false);
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

        it('should parse simple function parameters', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.PARAMETERS);

            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);

            expect(funktion.parameters.length).toBe(2);

            expect(funktion.parameters[0].name).toBe('param1');
            expect(funktion.parameters[0].value).toBe(undefined);

            expect(funktion.parameters[1].name).toBe('param2');
            expect(funktion.parameters[1].value).toBe(undefined);

            expect(funktion.body).toBe('{ }');
        });

        it('should parse default function parameters', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.DEFAULT_PARAMETERS);

            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            
            expect(funktion.parameters.length).toBe(2);

            expect(funktion.parameters[0].name).toBe('param1');
            expect(funktion.parameters[0].value).toBe("'value1'");

            expect(funktion.parameters[1].name).toBe('param2');
            expect(funktion.parameters[1].value).toBe('true');

            expect(funktion.body).toBe('{ }');
        });

        it('should parse a function rest parameter', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.REST_PARAMETERS);

            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            
            expect(funktion.parameters.length).toBe(1);

            expect(funktion.parameters[0].name).toBe('...param1');
            expect(funktion.parameters[0].value).toBe(undefined);

            expect(funktion.body).toBe('{ }');
        });

        it('should parse a simple function body', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.SIMPLE_BODY);

            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body).toBe("{ return 'value' ; }");
        });

        it('should parse a block function body', () =>
        {
            const funktion = parser.parseFunction(FUNCTIONS.BLOCK_BODY);

            expect(funktion.name).toBe('name');
            expect(funktion.isAsync).toBe(false);
            expect(funktion.parameters.length).toBe(0);
            expect(funktion.body).toBe("{ if ( true ) { return 'value' ; } }");
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
            expect(field.value).toBe("'const'");
        });

        it('should parse a let field with value', () =>
        {
            const field = parser.parseField(FIELDS.LET);

            expect(field.name).toBe('name');
            expect(field.value).toBe("'let'");
        });

        it('should parse a var field with value', () =>
        {
            const field = parser.parseField(FIELDS.VAR);

            expect(field.name).toBe('name');
            expect(field.value).toBe("'var'");
        });

        it('should parse a field with a statement value', () =>
        {
            const field = parser.parseField(FIELDS.SIMPLE_STATEMENT);

            expect(field.name).toBe('sum');
            expect(field.value).toBe("a + b");
        });

        it('should parse a field with a complex statement value', () =>
        {
            const field = parser.parseField(FIELDS.COMPLEX_STATEMENT);

            expect(field.name).toBe('sum');
            expect(field.value).toBe("new Number ( Math.ceil ( Math.random ( ) ) + 10 ) .toString ( )");
        });
    });
});
