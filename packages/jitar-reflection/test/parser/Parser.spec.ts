
import Parser from '../../src/parser/Parser';
import ReflectionImport from '../../src/models/ReflectionImport';

import { IMPORTS, EXPORTS, FIELDS, FUNCTIONS, CLASSES } from '../_fixtures/parser/Parser.fixture';

const parser = new Parser();

describe('parser/Parser', () =>
{
    describe('.parseModule(code)', () =>
    {
        it('should parse imports for loading a module', () =>
        {
            const module = parser.parseModule(IMPORTS.LOAD);

            expect(module.imports.length).toBe(1);

            const imported = module.imports[0];

            expect(imported.name).toBe('');
            expect(imported.as).toBe('');
            expect(imported.from).toBe("'module'");
        });

        it('should parse imports for importing a single member', () =>
        {
            const module = parser.parseModule(IMPORTS.IMPORT);

            expect(module.imports.length).toBe(1);

            const imported = module.imports[0];

            expect(imported.name).toBe('member');
            expect(imported.as).toBe('member');
            expect(imported.from).toBe("'module'");
        });

        it('should parse imports for importing a single member with alias', () =>
        {
            const module = parser.parseModule(IMPORTS.IMPORT_AS);

            expect(module.imports.length).toBe(1);

            const imported = module.imports[0];

            expect(imported.name).toBe('member');
            expect(imported.as).toBe('alias');
            expect(imported.from).toBe("'module'");
        });

        it('should parse imports for importing all members', () =>
        {
            const module = parser.parseModule(IMPORTS.IMPORT_ALL);

            expect(module.imports.length).toBe(1);

            const imported = module.imports[0];

            expect(imported.name).toBe('default');
            expect(imported.as).toBe('name');
            expect(imported.from).toBe("'module'");
        });

        it('should parse imports for importing the default member', () =>
        {
            const module = parser.parseModule(IMPORTS.IMPORT_DEFAULT);

            expect(module.imports.length).toBe(1);

            const imported = module.imports[0];

            expect(imported.name).toBe('default');
            expect(imported.as).toBe('name');
            expect(imported.from).toBe("'module'");
        });

        it('should parse imports for importing the default with another member', () =>
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

        it('should parse imports for importing the default with another member with alias', () =>
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

        it('should parse imports for importing the default with other members and aliases', () =>
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
