
import { Parser } from '@jitar/analysis';
import type { ESExport } from '@jitar/analysis';

import { Module, Segmentation, Segment, ResourceList } from '../source';
import { FileHelper } from '../utils';

const EXPORTS_ALL = '*';

const EXPORT_PATTERN = /export\s(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s]*([@\w/._-]+)["'\s].*/g;
const APPLICATION_MODULE_INDICATORS = ['.', '/', 'http:', 'https:'];

export default class ExportRewriter
{
    readonly #module: Module;
    readonly #segmentation: Segmentation;
    readonly #segment: Segment | undefined;

    readonly #parser = new Parser();
    readonly #fileHelper = new FileHelper();

    constructor(module: Module, segmentation: Segmentation, segment?: Segment)
    {
        this.#module = module;
        this.#segmentation = segmentation;
        this.#segment = segment;
    }

    rewrite(code: string): string
    {
        const replacer = (statement: string) => this.#replaceExport(statement);

        return code.replaceAll(EXPORT_PATTERN, replacer);
    }

    #replaceExport(statement: string): string
    {
        const dependency = this.#parser.parseExport(statement);

        if (dependency.from === undefined)
        {
            return statement;
        }

        if (dependency.from.includes('integrations')) console.log('Exporting integration:', dependency.from);

        return this.#isApplicationModule(dependency)
            ? this.#rewriteApplicationExport(dependency)
            : this.#rewriteRuntimeExport(dependency);
    }

    #isApplicationModule(dependency: ESExport): boolean
    {
        return APPLICATION_MODULE_INDICATORS.some(indicator => (dependency.from as string).startsWith(indicator, 1));
    }

    #rewriteApplicationExport(dependency: ESExport): string
    {
        const targetModuleFilename = this.#getTargetModuleFilename(dependency);

        if (this.#segmentation.isModuleSegmented(targetModuleFilename))
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

        const from = this.#rewriteApplicationFrom(targetModuleFilename, 'common');

        return this.#rewriteToStaticExport(dependency, from);
    }

    #rewriteRuntimeExport(dependency: ESExport): string
    {
        const from = this.#rewriteRuntimeFrom(dependency);

        return this.#rewriteToStaticExport(dependency, from);
    }

    #rewriteApplicationFrom(filename: string, scope: string): string
    {
        const callingModulePath = this.#fileHelper.extractPath(this.#module.filename);
        const relativeFilename = this.#fileHelper.makePathRelative(filename, callingModulePath);

        return this.#fileHelper.addSubExtension(relativeFilename, scope);
    }

    #rewriteRuntimeFrom(dependency: ESExport): string
    {
        return this.#stripFrom(dependency.from as string);
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
        const from = this.#stripFrom(dependency.from as string);
        const callingModulePath = this.#fileHelper.extractPath(this.#module.filename);
        const translated = this.#fileHelper.makePathAbsolute(from, callingModulePath);

        return this.#fileHelper.assureExtension(translated);
    }

    #stripFrom(from: string): string
    {
        return from.substring(1, from.length - 1);
    }
}
