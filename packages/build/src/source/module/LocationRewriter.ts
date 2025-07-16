
import { Parser } from '@jitar/analysis';
import type { FileManager } from '@jitar/sourcing';

import { Files, Patterns } from '../../definitions';
import { FileHelper } from '../../utils';

// The location rewriter ensures the '.js' for all application imports and re-exports
// and appends the 'index.js' reference for all directory imports.

export default class LocationRewriter
{
    readonly #sourceFileManager: FileManager;

    readonly #parser = new Parser();
    readonly #fileHelper = new FileHelper();

    constructor(sourceFileManager: FileManager)
    {
        this.#sourceFileManager = sourceFileManager;
    }

    rewrite(filename: string, code: string): string
    {
        const replacedImports = this.#rewriteImports(filename, code);
        
        return this.#rewriteExports(filename, replacedImports);
    }

    #rewriteImports(filename: string, code: string): string
    {
        const replacer = (statement: string) => this.#replaceImport(filename, statement);

        return code.replaceAll(Patterns.IMPORT, replacer);
    }

    #rewriteExports(filename: string, code: string): string
    {
        const replacer = (statement: string) => this.#replaceExport(filename, statement);

        return code.replaceAll(Patterns.EXPORT, replacer);
    }

    #replaceImport(filename: string, statement: string): string
    {
        const dependency = this.#parser.parseImport(statement);
        const from = this.#fileHelper.stripPath(dependency.from);
        const normalizedFrom = this.#sourceFileManager.normalizeLocation(from);

        if (this.#fileHelper.isApplicationModule(normalizedFrom) === false)
        {
            return statement;
        }

        const rewrittenFrom = this.#rewriteFrom(filename, normalizedFrom);

        return statement.replace(from, rewrittenFrom);
    }

    #replaceExport(filename: string, statement: string): string
    {
        const dependency = this.#parser.parseExport(statement);

        if (dependency.from === undefined)
        {
            return statement;
        }

        const from = this.#fileHelper.stripPath(dependency.from);
        const normalizedFrom = this.#sourceFileManager.normalizeLocation(from);

        if (this.#fileHelper.isApplicationModule(normalizedFrom) === false)
        {
            return statement;
        }

        const rewrittenFrom = this.#rewriteFrom(filename, normalizedFrom);

        return statement.replace(from, rewrittenFrom);
    }

    #rewriteFrom(filename: string, from: string): string
    {
        const callingModulePath = this.#fileHelper.extractPath(filename);
        const translated = this.#fileHelper.makePathAbsolute(from, callingModulePath);

        return this.#sourceFileManager.isDirectory(translated)
            ? `${from}/${Files.INDEX}`
            : this.#fileHelper.assureExtension(from);
    }
}
