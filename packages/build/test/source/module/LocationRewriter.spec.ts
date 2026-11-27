
import { describe, expect, it } from 'vitest';

import { FILENAMES, LOCATION_REWRITERS, MODULES } from './fixtures';

const rewriter = LOCATION_REWRITERS.GENERAL;

describe('source/module/LocationRewriter', () =>
{
    describe('.rewrite(module, filename)', () =>
    {
        describe('imports', () =>
        {
            it('should add the .js extension to an application file import', () =>
            {
                const module = MODULES.FILE_IMPORT();

                rewriter.rewrite(module, FILENAMES.REMOTE_HANDLER);

                expect(module.imports).toHaveLength(1);
                expect(module.imports[0].from).toBe('./greeting.js');
            });

            it('should keep the extension of an application file import that already has one', () =>
            {
                const module = MODULES.FILE_IMPORT_WITH_EXTENSION();

                rewriter.rewrite(module, FILENAMES.REMOTE_HANDLER);

                expect(module.imports).toHaveLength(1);
                expect(module.imports[0].from).toBe('./greeting.js');
            });

            it('should normalize the Windows path separator of an application file import', () =>
            {
                const module = MODULES.WINDOWS_FILE_IMPORT();

                rewriter.rewrite(module, FILENAMES.REMOTE_HANDLER);

                expect(module.imports).toHaveLength(1);
                expect(module.imports[0].from).toBe('./greeting.js');
            });

            it('should append index.js to an application directory import', () =>
            {
                const module = MODULES.DIRECTORY_IMPORT();

                rewriter.rewrite(module, FILENAMES.REMOTE_HANDLER);

                expect(module.imports).toHaveLength(1);
                expect(module.imports[0].from).toBe('./config/index.js');
            });

            it('should append index.js to an application directory import that uses a parent reference', () =>
            {
                const module = MODULES.PARENT_DIRECTORY_IMPORT();

                rewriter.rewrite(module, FILENAMES.REMOTE_HANDLER);

                expect(module.imports).toHaveLength(1);
                expect(module.imports[0].from).toBe('../shared/index.js');
            });

            it('should add the .js extension to an application file import that uses a parent reference', () =>
            {
                const module = MODULES.PARENT_FILE_IMPORT();

                rewriter.rewrite(module, FILENAMES.REMOTE_HANDLER);

                expect(module.imports).toHaveLength(1);
                expect(module.imports[0].from).toBe('../shared/utils.js');
            });

            it('should add the .js extension to a remote application import', () =>
            {
                const module = MODULES.URL_IMPORT();

                rewriter.rewrite(module, FILENAMES.REMOTE_HANDLER);

                expect(module.imports).toHaveLength(1);
                expect(module.imports[0].from).toBe('https://example.com/modules/handler.js');
            });

            it('should not rewrite a non-application import', () =>
            {
                const module = MODULES.RUNTIME_IMPORT();

                rewriter.rewrite(module, FILENAMES.REMOTE_HANDLER);

                expect(module.imports).toHaveLength(1);
                expect(module.imports[0].from).toBe('@jitar/runtime');
            });

            it('should add the .js extension to a file import of a root module', () =>
            {
                const module = MODULES.FILE_IMPORT();

                rewriter.rewrite(module, FILENAMES.ROOT_HANDLER);

                expect(module.imports).toHaveLength(1);
                expect(module.imports[0].from).toBe('./greeting.js');
            });

            it('should append index.js to a directory import of a root module', () =>
            {
                const module = MODULES.DIRECTORY_IMPORT();

                rewriter.rewrite(module, FILENAMES.ROOT_HANDLER);

                expect(module.imports).toHaveLength(1);
                expect(module.imports[0].from).toBe('./config/index.js');
            });

            // TODO: Add tests for absolute (/) application imports
        });

        describe('exports', () =>
        {
            it('should not rewrite an export without a source module', () =>
            {
                const module = MODULES.LOCAL_EXPORT();

                rewriter.rewrite(module, FILENAMES.REMOTE_HANDLER);

                expect(module.exports).toHaveLength(1);
                expect(module.exports[0].from).toBeUndefined();
            });

            it('should add the .js extension to a re-export of an application file', () =>
            {
                const module = MODULES.RE_EXPORT_FILE();

                rewriter.rewrite(module, FILENAMES.REMOTE_HANDLER);

                expect(module.exports).toHaveLength(1);
                expect(module.exports[0].from).toBe('./greeting.js');
            });

            it('should append index.js to a re-export of an application directory', () =>
            {
                const module = MODULES.RE_EXPORT_DIRECTORY();

                rewriter.rewrite(module, FILENAMES.REMOTE_HANDLER);

                expect(module.exports).toHaveLength(1);
                expect(module.exports[0].from).toBe('./config/index.js');
            });

            it('should not rewrite a re-export of a non-application module', () =>
            {
                const module = MODULES.RE_EXPORT_RUNTIME();

                rewriter.rewrite(module, FILENAMES.REMOTE_HANDLER);

                expect(module.exports).toHaveLength(1);
                expect(module.exports[0].from).toBe('@jitar/runtime');
            });
        });

        describe('module', () =>
        {
            it('should rewrite all application imports and re-exports at once', () =>
            {
                const module = MODULES.HANDLER();

                rewriter.rewrite(module, FILENAMES.REMOTE_HANDLER);

                expect(module.imports).toHaveLength(4);
                expect(module.imports[0].from).toBe('./greeting.js');
                expect(module.imports[1].from).toBe('./config/index.js');
                expect(module.imports[2].from).toBe('../shared/utils.js');
                expect(module.imports[3].from).toBe('@jitar/runtime');

                expect(module.exports).toHaveLength(2);
                expect(module.exports[0].from).toBeUndefined();
                expect(module.exports[1].from).toBe('./greeting.js');

                // Only the location is rewritten, the members stay untouched

                expect(module.imports[0].members).toHaveLength(1);
                expect(module.imports[0].members[0].identifier).toBe('greet');
                expect(module.exports[1].members).toHaveLength(1);
                expect(module.exports[1].members[0].identifier).toBe('reGreet');
            });
        });
    });
});
