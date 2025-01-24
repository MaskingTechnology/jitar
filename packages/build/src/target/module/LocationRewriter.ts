
import { Parser } from '@jitar/analysis';
import type { ESImport, ESExport } from '@jitar/analysis';

import type { Module, Segmentation, Segment, ResourcesList } from '../../source';
import { FileHelper } from '../../utils';

type ModuleImportKeys = { segmentKeys: string[], remoteKeys: string[], commonKeys: string[] };

export default abstract class LocationRewriter
{
    readonly #module: Module;
    readonly #resources: ResourcesList;
    readonly #segmentation: Segmentation;
    readonly #segment: Segment | undefined;

    readonly #parser = new Parser();
    readonly #fileHelper = new FileHelper();

    constructor(module: Module, resources: ResourcesList, segmentation: Segmentation, segment?: Segment)
    {
        this.#module = module;
        this.#resources = resources;
        this.#segmentation = segmentation;
        this.#segment = segment;
    }

    get parser() { return this.#parser; }

    abstract get replacementPattern(): RegExp;

    rewrite(code: string): string
    {
        const replacer = (statement: string) => this.replaceStatement(statement);

        return code.replaceAll(this.replacementPattern, replacer);
    }

    replaceStatement(statement: string): string
    {
        const dependency = this.parseStatement(statement);

        if (dependency.from === undefined)
        {
            return statement;
        }

        return this.#isApplicationModule(dependency)
            ? this.#rewriteForApplication(dependency)
            : this.#rewriteForRuntime(dependency);
    }

    abstract parseStatement(statement: string): ESImport | ESExport;

    #rewriteForApplication(dependency: ESImport | ESExport): string
    {
        const targetModuleFilename = this.#getTargetModuleFilename(dependency);

        if (this.#resources.isResourceModule(targetModuleFilename))
        {
            return this.#rewriteToResource(targetModuleFilename, dependency);
        }

        return this.#rewriteModule(targetModuleFilename, dependency);
    }

    #rewriteForRuntime(dependency: ESImport | ESExport): string
    {
        const from = this.#rewriteRuntimeFrom(dependency);
        const keys = dependency.members.map(member => member.name);

        return this.includeInBundle(dependency, from, keys);
    }

    #rewriteModule(targetModuleFilename: string, dependency: ESImport | ESExport): string
    {
        if (dependency.members.length === 0)
        {
            return this.#rewriteToCommon(targetModuleFilename, dependency, []);
        }

        const { segmentKeys, remoteKeys, commonKeys } = this.#getModuleImportKeys(targetModuleFilename, dependency);

        const imports: string[] = [];

        if (segmentKeys.length > 0)
        {
            imports.push(this.#rewriteToSegment(targetModuleFilename, dependency, segmentKeys));
        }

        if (remoteKeys.length > 0)
        {
            imports.push(this.#rewriteToRemote(targetModuleFilename, dependency, remoteKeys));
        }

        if (commonKeys.length > 0)
        {
            imports.push(this.#rewriteToCommon(targetModuleFilename, dependency, commonKeys));
        }

        return imports.filter(item => item.length > 0).join('\n');
    }

    #rewriteToResource(targetModuleFilename: string, dependency: ESImport | ESExport): string
    {
        const from = this.#rewriteApplicationFrom(targetModuleFilename);

        return this.excludeFromBundle(dependency, from);
    }

    #rewriteToSegment(targetModuleFilename: string, dependency: ESImport | ESExport, keys: string[]): string
    {
        const from = this.#rewriteApplicationFrom(targetModuleFilename, this.#segment!.name);

        return this.includeInBundle(dependency, from, keys);
    }

    #rewriteToRemote(targetModuleFilename: string, dependency: ESImport | ESExport, keys: string[]): string
    {
        const from = this.#rewriteApplicationFrom(targetModuleFilename, 'remote');

        return this.includeInBundle(dependency, from, keys);
    }

    #rewriteToCommon(targetModuleFilename: string, dependency: ESImport | ESExport, keys: string[]): string
    {
        const from = this.#rewriteApplicationFrom(targetModuleFilename);

        return this.includeInBundle(dependency, from, keys);
    }

    #isApplicationModule(dependency: ESImport | ESExport): boolean
    {
        const from = this.#fileHelper.stripPath(dependency.from as string);

        return this.#fileHelper.isApplicationModule(from);
    }

    #getTargetModuleFilename(dependency: ESImport | ESExport): string
    {
        const from = this.#fileHelper.stripPath(dependency.from as string);
        const callingModulePath = this.#fileHelper.extractPath(this.#module.filename);
        
        return this.#fileHelper.makePathAbsolute(from, callingModulePath);
    }

    #getModuleImportKeys(targetModuleFilename: string, dependency: ESImport | ESExport): ModuleImportKeys
    {
        const moduleSegmentKeys = this.#getSegmentImportKeys(targetModuleFilename, this.#segment);
        const moduleRemoteKeys = this.#getRemoteImportKeys(targetModuleFilename, moduleSegmentKeys);

        const segmentKeys = this.#filterMemberKeys(dependency, moduleSegmentKeys);
        const remoteKeys = this.#filterMemberKeys(dependency, moduleRemoteKeys);
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

    #filterMemberKeys(dependency: ESImport | ESExport, keys: string[]): string[]
    {
        return dependency.members
            .filter(member => keys.includes(member.name))
            .map(member => member.name);
    }

    #extractUnsegmentedImportKeys(dependency: ESImport | ESExport, segmentedKeys: string[]): string[]
    {
        return dependency.members
            .filter(member => segmentedKeys.includes(member.name) === false)
            .map(member => member.name);
    }

    #rewriteApplicationFrom(filename: string, scope?: string): string
    {
        const callingModulePath = this.#fileHelper.extractPath(this.#module.filename);
        const relativeFilename = this.#fileHelper.makePathRelative(filename, callingModulePath);

        return scope !== undefined
            ? this.#fileHelper.addSubExtension(relativeFilename, scope)
            : relativeFilename;
    }

    #rewriteRuntimeFrom(dependency: ESImport | ESExport): string
    {
        return this.#fileHelper.stripPath(dependency.from as string);
    }

    abstract includeInBundle(dependency: ESImport | ESExport, from: string, keys: string[]): string;

    abstract excludeFromBundle(dependency: ESImport | ESExport, from: string): string;
}
