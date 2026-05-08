
import type { ESModule, ESImport, ESExport } from '@jitar/analysis';
import type { FileManager } from '@jitar/sourcing';

import { Files } from '../../definitions';
import { FileHelper } from '../../utils';

// The location rewriter ensures the '.js' for all application imports and re-exports
// and appends the 'index.js' reference for all directory imports.

export default class LocationRewriter
{
    readonly #sourceFileManager: FileManager;

    readonly #fileHelper = new FileHelper();

    constructor(sourceFileManager: FileManager)
    {
        this.#sourceFileManager = sourceFileManager;
    }

    rewrite(module: ESModule, filename: string): void
    {
        module.imports.forEach(item => this.#rewriteImport(item, filename));
        module.exports.forEach(item => this.#rewriteExport(item, filename));
    }

    #rewriteImport(item: ESImport, filename: string): void
    {
        const normalizedFrom = this.#sourceFileManager.normalizeLocation(item.from);

        if (this.#fileHelper.isApplicationModule(normalizedFrom) === false)
        {
            return;
        }

        item.from = this.#rewriteFrom(filename, normalizedFrom);
    }

    #rewriteExport(item: ESExport, filename: string): void
    {
        if (item.from === undefined)
        {
            return;
        }

        const normalizedFrom = this.#sourceFileManager.normalizeLocation(item.from);

        if (this.#fileHelper.isApplicationModule(normalizedFrom) === false)
        {
            return;
        }

        item.from = this.#rewriteFrom(filename, normalizedFrom);
    }

    #rewriteFrom(filename: string, from: string): string
    {
        const callingModulePath = this.#fileHelper.extractPath(filename);
        const translated = this.#fileHelper.makePathAbsolute(from, callingModulePath, '');

        return this.#sourceFileManager.isDirectory(translated)
            ? `${from}/${Files.INDEX}`
            : this.#fileHelper.assureExtension(from);
    }
}
