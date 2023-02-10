
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
        it('should ...', () =>
        {
            
        });
    });

    describe('.parseFunction(code)', () =>
    {
        it('should ...', () =>
        {
            
        });
    });
});
