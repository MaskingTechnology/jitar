
import { Parser } from '@jitar/analysis';
import type { ESExport } from '@jitar/analysis';

import type { Module, Segmentation, Segment } from '../../source';
import { FileHelper, LocationReplacer } from '../../utils';

const EXPORTS_ALL = '*';

type ModuleImportKeys = { segmentKeys: string[], remoteKeys: string[], commonKeys: string[] };

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

    // Duplicate of ImportRewriter.ts
    #isApplicationModule(dependency: ESExport): boolean
    {
        const from = this.#fileHelper.stripPath(dependency.from as string);

        return this.#fileHelper.isApplicationModule(from);
    }

    #rewriteApplicationExport(dependency: ESExport): string
    {
        const targetModuleFilename = this.#getTargetModuleFilename(dependency);

        return this.#rewriteModuleExport(targetModuleFilename, dependency);
    }

    #rewriteModuleExport(targetModuleFilename: string, dependency: ESExport): string
    {
        const { segmentKeys, remoteKeys, commonKeys } = this.#getModuleImportKeys(targetModuleFilename, dependency);

        const imports: string[] = [];

        if (segmentKeys.length > 0)
        {
            imports.push(this.#rewriteSegmentExport(targetModuleFilename, dependency, segmentKeys));
        }

        if (remoteKeys.length > 0)
        {
            imports.push(this.#rewriteRemoteExport(targetModuleFilename, dependency, remoteKeys));
        }

        if (commonKeys.length > 0)
        {
            imports.push(this.#rewriteCommonExport(targetModuleFilename, dependency, commonKeys));
        }

        return imports.join('\n');
    }

    #rewriteSegmentExport(targetModuleFilename: string, dependency: ESExport, keys: string[]): string
    {
        const from = this.#rewriteApplicationFrom(targetModuleFilename, this.#segment!.name);

        return this.#rewriteToStaticExport(dependency, from, keys);
    }

    #rewriteRemoteExport(targetModuleFilename: string, dependency: ESExport, keys: string[]): string
    {
        const from = this.#rewriteApplicationFrom(targetModuleFilename, 'remote');

        return this.#rewriteToStaticExport(dependency, from, keys);
    }

    #rewriteCommonExport(targetModuleFilename: string, dependency: ESExport, keys: string[]): string
    {
        const from = this.#rewriteApplicationFrom(targetModuleFilename);

        return this.#rewriteToStaticExport(dependency, from, keys);
    }

    #rewriteRuntimeExport(dependency: ESExport): string
    {
        const from = this.#rewriteRuntimeFrom(dependency);
        const keys = dependency.members.map(member => member.name);

        return this.#rewriteToStaticExport(dependency, from, keys);
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

    #rewriteToStaticExport(dependency: ESExport, from: string, keys: string[]): string
    {
        if (dependency.members.length === 0)
        {
            return `export "${from}";`;
        }

        const members = this.#rewriteStaticExportMembers(dependency, keys);

        return `export ${members} from "${from}";`;
    }

    #rewriteStaticExportMembers(dependency: ESExport, keys: string[]): string
    {
        const members = dependency.members.filter(member => keys.includes(member.name));

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

    /// COPIED FROM ImportRewriter.ts ///

    #getModuleImportKeys(targetModuleFilename: string, dependency: ESExport): ModuleImportKeys
    {
        const segmentKeys = this.#getSegmentImportKeys(targetModuleFilename, this.#segment);
        const remoteKeys = this.#getRemoteImportKeys(targetModuleFilename, segmentKeys);
        const commonKeys = this.#extractUnsegmentedImportKeys(dependency, [...segmentKeys, ...remoteKeys]);

        return { segmentKeys, remoteKeys, commonKeys };
    }

    #getSegmentImportKeys(targetModuleFilename: string, segment?: Segment): string[]
    {
        if (segment === undefined)
        {
            return [];
        }

        const module = segment.getModule(targetModuleFilename);

        return module !== undefined
            ? Object.keys(module.imports)
            : [];
    }

    #getRemoteImportKeys(targetModuleFilename: string, segmentKeys: string[]): string[]
    {
        const segments = this.#segmentation.getSegments(targetModuleFilename).filter(segment => segment !== this.#segment);
        const importKeys = segments.map(segment => this.#getSegmentImportKeys(targetModuleFilename, segment)).flat();
        const uniqueKeys = [...new Set(importKeys)];

        return uniqueKeys.filter(key => segmentKeys.includes(key) === false);
    }

    #extractUnsegmentedImportKeys(dependency: ESExport, segmentedKeys: string[]): string[]
    {
        return dependency.members
            .filter(member => segmentedKeys.includes(member.name) === false)
            .map(member => member.name);
    }
}
