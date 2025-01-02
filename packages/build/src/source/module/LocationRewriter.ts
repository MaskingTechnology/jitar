
import { Parser } from '@jitar/analysis';
import type { FileManager } from '@jitar/sourcing';

import { FileHelper, LocationReplacer } from '../../utils';

export default class LocationRewriter
{
    readonly #sourceFileManager: FileManager;

    readonly #parser = new Parser();
    readonly #fileHelper = new FileHelper();
    readonly #locationReplacer = new LocationReplacer();

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

        return this.#locationReplacer.replaceImports(code, replacer);
    }

    #rewriteExports(filename: string, code: string): string
    {
        const replacer = (statement: string) => this.#replaceExport(filename, statement);

        return this.#locationReplacer.replaceExports(code, replacer);
    }

    #replaceImport(filename: string, statement: string): string
    {
        const dependency = this.#parser.parseImport(statement);
        const from = this.#stripFrom(dependency.from);

        if (this.#fileHelper.isApplicationModule(from) === false)
        {
            return statement;
        }

        const rewrittenFrom = this.#rewriteFrom(filename, from);

        return statement.replace(from, rewrittenFrom);
    }

    #replaceExport(filename: string, statement: string): string
    {
        const dependency = this.#parser.parseExport(statement);

        if (dependency.from === undefined)
        {
            return statement;
        }

        const from = this.#stripFrom(dependency.from);

        if (this.#fileHelper.isApplicationModule(from) === false)
        {
            return statement;
        }

        const rewrittenFrom = this.#rewriteFrom(filename, from);

        return statement.replace(from, rewrittenFrom);
    }

    #rewriteFrom(filename: string, from: string): string
    {
        const callingModulePath = this.#fileHelper.extractPath(filename);
        const translated = this.#fileHelper.makePathAbsolute(from, callingModulePath);

        return this.#sourceFileManager.isDirectory(translated)
            ? `${from}/index.js`
            : this.#fileHelper.assureExtension(from);
    }

    #stripFrom(from: string): string
    {
        return from.substring(1, from.length - 1);
    }
}
