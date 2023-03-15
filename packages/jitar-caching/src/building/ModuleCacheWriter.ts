
import { FileManager, convertToLocalFilename, convertToRemoteFilename } from 'jitar-runtime';

import ModuleCache from './models/ModuleCache.js';
import Module from './models/Module.js';
import SegmentModule from './models/SegmentModule.js';

import ImportRewriter from './utils/ImportRewriter.js';
import RemoteBuilder from './utils/RemoteBuilder.js';

const importRewriter = new ImportRewriter();
const remoteBuilder = new RemoteBuilder();

export default class ModuleCacheWriter
{
    #fileManager: FileManager;

    constructor(fileManager: FileManager)
    {
        this.#fileManager = fileManager;
    }

    async write(cache: ModuleCache): Promise<void>
    {
        return Promise.all([
            this.#writeLocal(cache),
            this.#writeRemote(cache)
        ]).then(() => {});
    }

    async #writeLocal(cache: ModuleCache): Promise<void>
    {
        const importCode = this.#rewriteImports(cache.module);
        const sourceCode = this.#createSourceCode(cache.module, importCode);

        const filename = convertToLocalFilename(cache.module.filename);
        const code = `${importCode}\n${sourceCode}`;

        return this.#fileManager.write(filename, code.trim());
    }

    #rewriteImports(module: Module): string
    {
        return importRewriter.rewrite(module.code);
    }

    #createSourceCode(module: Module, code: string): string
    {
        const filename = module.filename;
        const classes = module.content.exportedClasses;
        const classNames = classes.map(clazz => clazz.name);
        const sourceCode = classNames.map(className => `${className}.source = "${filename}";`);

        return sourceCode.join('\n');
    }

    async #writeRemote(cache: ModuleCache): Promise<void>
    {
        if (cache.segment === undefined)
        {
            return;
        }

        const filename = convertToRemoteFilename(cache.module.filename);
        const code = this.#createRemoteCode(cache.segment);

        return this.#fileManager.write(filename, code.trim());
    }

    #createRemoteCode(module: SegmentModule): string
    {
        return remoteBuilder.build(module);
    }
}
