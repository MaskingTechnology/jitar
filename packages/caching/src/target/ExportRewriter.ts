
import { Reflector } from '@jitar/reflection';
import type { ReflectionExport } from '@jitar/reflection';

import type { Module, Segmentation, Segment } from '../source';
import { FileHelper } from '../utils';

const KEYWORD_DEFAULT = 'default';
const EXPORTS_ALL = '*';

const EXPORT_PATTERN = /export\s(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s]*([@\w/._-]+)["'\s].*/g;
const APPLICATION_MODULE_INDICATORS = ['.', '/', 'http:', 'https:'];

const reflector = new Reflector();

export default class ExportRewriter
{
    #module: Module;
    #segmentation: Segmentation;
    #segment: Segment | undefined;

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
        const dependency = reflector.parseExport(statement);

        if (dependency.from === undefined)
        {
            return statement;
        }

        return this.#isApplicationModule(dependency)
            ? this.#rewriteApplicationExport(dependency)
            : this.#rewriteRuntimeExport(dependency);
    }

    #isApplicationModule(dependency: ReflectionExport): boolean
    {
        return APPLICATION_MODULE_INDICATORS.some(indicator => dependency.from!.startsWith(indicator, 1));
    }

    #rewriteApplicationExport(dependency: ReflectionExport): string
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

        // export shared (unsegmented) module

        if (this.#segment !== undefined)
        {
            console.warn('Exporting shared module from a segmented module!');
        }

        const from = this.#rewriteApplicationFrom(targetModuleFilename, 'shared');

        return this.#rewriteToStaticExport(dependency, from)
    }

    #rewriteRuntimeExport(dependency: ReflectionExport): string
    {
        const from = this.#rewriteRuntimeFrom(dependency);

        return this.#rewriteToStaticExport(dependency, from);
    }

    #rewriteApplicationFrom(filename: string, scope: string): string
    {
        const callingModulePath = FileHelper.extractPath(this.#module.filename);
        const relativeFilename = FileHelper.makePathRelative(filename, callingModulePath);

        return FileHelper.addSubExtension(relativeFilename, scope);
    }

    #rewriteRuntimeFrom(dependency: ReflectionExport): string
    {
        return this.#stripFrom(dependency.from!);
    }

    #rewriteToStaticExport(dependency: ReflectionExport, from: string): string
    {
        if (dependency.members.length === 0)
        {
            return `export "${from}";`;
        }

        const members = this.#rewriteStaticExportMembers(dependency);

        return `export ${members} from "${from}";`;
    }

    #rewriteStaticExportMembers(dependency: ReflectionExport): string
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

    #getTargetModuleFilename(dependency: ReflectionExport): string
    {
        const from = this.#stripFrom(dependency.from!);
        const callingModulePath = FileHelper.extractPath(this.#module.filename);
        const translated = FileHelper.makePathAbsolute(from, callingModulePath);

        return FileHelper.assureExtension(translated);
    }

    #stripFrom(from: string): string
    {
        return from.substring(1, from.length - 1);
    }
}
