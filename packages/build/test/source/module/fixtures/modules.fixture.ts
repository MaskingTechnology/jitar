
import { ESExport, ESImport, ESModule, ESModuleMember } from '@jitar/analysis';

// The location rewriter mutates the import/export items in place,
// so every fixture is a factory that returns a fresh module.

const FILENAMES =
{
    REMOTE_HANDLER: 'modules/remote/handler.ts',
    ROOT_HANDLER: 'handler.ts'
} as const;

const MODULES =
{
    REMOTE_FILE_IMPORT: () => new ESModule([
        new ESImport([new ESModuleMember('greet')], './greeting')
    ]),

    REMOTE_FILE_IMPORT_WITH_EXTENSION: () => new ESModule([
        new ESImport([new ESModuleMember('greet')], './greeting.js')
    ]),

    REMOTE_DIRECTORY_IMPORT: () => new ESModule([
        new ESImport([new ESModuleMember('config')], './config')
    ]),

    REMOTE_PARENT_DIRECTORY_IMPORT: () => new ESModule([
        new ESImport([new ESModuleMember('shared')], '../shared')
    ]),

    REMOTE_PARENT_FILE_IMPORT: () => new ESModule([
        new ESImport([new ESModuleMember('utils')], '../shared/utils')
    ]),

    REMOTE_URL_IMPORT: () => new ESModule([
        new ESImport([new ESModuleMember('handler')], 'https://example.com/modules/handler')
    ]),

    RUNTIME_IMPORT: () => new ESModule([
        new ESImport([new ESModuleMember('doSomething')], '@jitar/runtime')
    ]),

    ROOT_FILE_IMPORT: () => new ESModule([
        new ESImport([new ESModuleMember('greet')], './greeting')
    ]),

    ROOT_DIRECTORY_IMPORT: () => new ESModule([
        new ESImport([new ESModuleMember('config')], './config')
    ]),

    LOCAL_EXPORT: () => new ESModule([
        new ESExport([new ESModuleMember('handler')], undefined)
    ]),

    RE_EXPORT_FILE: () => new ESModule([
        new ESExport([new ESModuleMember('greet')], './greeting')
    ]),

    RE_EXPORT_DIRECTORY: () => new ESModule([
        new ESExport([new ESModuleMember('config')], './config')
    ]),

    RE_EXPORT_RUNTIME: () => new ESModule([
        new ESExport([new ESModuleMember('doSomething')], '@jitar/runtime')
    ]),

    HANDLER: () => new ESModule([
        new ESImport([new ESModuleMember('greet')], './greeting'),
        new ESImport([new ESModuleMember('config')], './config'),
        new ESImport([new ESModuleMember('utils')], '../shared/utils'),
        new ESImport([new ESModuleMember('doSomething')], '@jitar/runtime'),
        new ESExport([new ESModuleMember('handler')], undefined),
        new ESExport([new ESModuleMember('reGreet')], './greeting')
    ])
};

export { FILENAMES, MODULES };
