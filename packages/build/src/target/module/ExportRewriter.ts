
import { Parser } from '@jitar/analysis';
import type { ESExport } from '@jitar/analysis';

import type { Module, Segmentation, Segment } from '../../source';
import { FileHelper, LocationReplacer } from '../../utils';

const EXPORTS_ALL = '*';

export default class ExportRewriter
{
    readonly #module: Module;
    readonly #segmentation: Segmentation;
    readonly #segment: Segment | undefined;

    readonly #parser = new Parser();
    readonly #fileHelper = new FileHelper();
    readonly #locationReplacer = new LocationReplacer();

    constructor(module: Module, segmentation: Segmentation, segment?: Segment)
    {
        this.#module = module;
        this.#segmentation = segmentation;
        this.#segment = segment;
    }

    rewrite(code: string): string
    {
        const replacer = (statement: string) => this.#replaceExport(statement);

        return this.#locationReplacer.replaceExports(code, replacer);
    }

    #replaceExport(statement: string): string
    {
        const dependency = this.#parser.parseExport(statement);

        if (dependency.from === undefined)
        {
            return statement;
        }

        return this.#isApplicationModule(dependency)
            ? this.#rewriteApplicationExport(dependency)
            : this.#rewriteRuntimeExport(dependency);
    }

    #isApplicationModule(dependency: ESExport): boolean
    {
        const from = this.#fileHelper.stripPath(dependency.from as string);

        return this.#fileHelper.isApplicationModule(from);
    }

    #rewriteApplicationExport(dependency: ESExport): string
    {
        const targetModuleFilename = this.#getTargetModuleFilename(dependency);

        if (this.#segmentation.isSegmentedModule(targetModuleFilename))
        {
            // export segmented module

            if (this.#segment?.hasModule(targetModuleFilename))
            {
                const from = this.#rewriteApplicationFrom(targetModuleFilename, this.#segment.name);

                return this.#rewriteToStaticExport(dependency, from); // same segment
            }

            console.warn('Exporting a module from another segment!');

            const from = this.#rewriteApplicationFrom(targetModuleFilename, 'remote');

            return this.#rewriteToStaticExport(dependency, from); // different segments
        }

        // export common (unsegmented) module

        if (this.#segment !== undefined)
        {
            console.warn('Exporting common module from a segmented module!');
        }

        const from = this.#rewriteApplicationFrom(targetModuleFilename);

        return this.#rewriteToStaticExport(dependency, from);
    }

    #rewriteRuntimeExport(dependency: ESExport): string
    {
        const from = this.#rewriteRuntimeFrom(dependency);

        return this.#rewriteToStaticExport(dependency, from);
    }

    #rewriteApplicationFrom(filename: string, scope?: string): string
    {
        const callingModulePath = this.#fileHelper.extractPath(this.#module.filename);
        const relativeFilename = this.#fileHelper.makePathRelative(filename, callingModulePath);

        return scope === undefined
            ? relativeFilename
            : this.#fileHelper.addSubExtension(relativeFilename, scope);
    }

    #rewriteRuntimeFrom(dependency: ESExport): string
    {
        return this.#fileHelper.stripPath(dependency.from as string);
    }

    #rewriteToStaticExport(dependency: ESExport, from: string): string
    {
        if (dependency.members.length === 0)
        {
            return `export "${from}";`;
        }

        const members = this.#rewriteStaticExportMembers(dependency);

        return `export ${members} from "${from}";`;
    }

    #rewriteStaticExportMembers(dependency: ESExport): string
    {
        const members = dependency.members;

        if (members.length === 1 && members[0].name === '')
        {
            const member = members[0];

            return member.name !== member.as ? `${EXPORTS_ALL} as ${member.as}` : EXPORTS_ALL;
        }

        const memberExports = members.map(member => member.name !== member.as ? `${member.name} as ${member.as}` : member.name);

        return `{ ${memberExports.join(', ')} }`;
    }

    #getTargetModuleFilename(dependency: ESExport): string
    {
        const from = this.#fileHelper.stripPath(dependency.from as string);
        const callingModulePath = this.#fileHelper.extractPath(this.#module.filename);
        
        return this.#fileHelper.makePathAbsolute(from, callingModulePath);
    }
}
