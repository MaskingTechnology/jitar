
import type { ESImport, ESExport, ESModuleMember, ESModule } from '@jitar/analysis';

import type { Module, Segmentation, Segment, ResourcesList } from '../../source';
import { FileHelper } from '../../utils';

type ModuleImportKeys = { segmentKeys: string[], remoteKeys: string[], commonKeys: string[] };

export default class LocalGenerator
{
    readonly #module: Module;
    readonly #resources: ResourcesList;
    readonly #segmentation: Segmentation;
    readonly #segment: Segment | undefined;

    readonly #fileHelper = new FileHelper();

    constructor(module: Module, resources: ResourcesList, segmentation: Segmentation, segment?: Segment)
    {
        this.#module = module;
        this.#resources = resources;
        this.#segmentation = segmentation;
        this.#segment = segment;
    }

    generate(): string
    {
        const model = this.#module.model.clone();

        this.#rewriteItems(model, model.imports);
        this.#rewriteItems(model, model.exports);

        return model.toString();
    }

    #rewriteItems<T extends (ESImport | ESExport)>(model: ESModule, items: T[]): void
    {
        for (const item of items)
        {
            const rewritten = this.#rewriteItem(item);

            if (rewritten.length === 0)
            {
                continue;
            }

            const index = model.statements.indexOf(item);

            if (index === -1)
            {
                throw new Error('Statement not found!');
            }

            model.statements.splice(index, 1, ...rewritten);
        }
    }

    #rewriteItem<T extends (ESImport | ESExport)>(item: T): T[]
    {
        if (this.#skipRewrite(item)) return [];

        const targetModuleFilename = this.#getTargetModuleFilename(item);

        if (this.#resources.isResourceModule(targetModuleFilename))
        {
            return this.#rewriteToResource(item, targetModuleFilename,);
        }

        return this.#rewriteToApplication(item, targetModuleFilename);
    }

    #skipRewrite<T extends (ESImport | ESExport)>(item: T): boolean
    {
        return item.from === undefined || this.#isRuntimeModule(item);
    }

    #isRuntimeModule<T extends (ESImport | ESExport)>(item: T): boolean
    {
        return this.#fileHelper.isApplicationModule(item.from!) === false;
    }

    #getTargetModuleFilename<T extends (ESImport | ESExport)>(item: T): string
    {
        const from = item.from!;
        const callingModulePath = this.#fileHelper.extractPath(this.#module.filename);
        
        return this.#fileHelper.makePathAbsolute(from, callingModulePath, '');
    }

    #rewriteToResource<T extends (ESImport | ESExport)>(item: T, targetModuleFilename: string): T[]
    {
        // Rewrite to dynamic import?
        item.from = this.#rewriteApplicationFrom(targetModuleFilename);

        return [];
    }

    #rewriteToApplication<T extends (ESImport | ESExport)>(item: T, targetModuleFilename: string): T[]
    {
        if (item.members.length === 0)
        {
            return [this.#rewriteToCommon(targetModuleFilename, item, [])];
        }

        const { segmentKeys, remoteKeys, commonKeys } = this.#getModuleImportKeys(targetModuleFilename, item);

        const rewrites: T[] = [];

        if (segmentKeys.length > 0)
        {
            rewrites.push(this.#rewriteToSegment(targetModuleFilename, item, segmentKeys));
        }

        if (remoteKeys.length > 0)
        {
            rewrites.push(this.#rewriteToRemote(targetModuleFilename, item, remoteKeys));
        }

        if (commonKeys.length > 0)
        {
            rewrites.push(this.#rewriteToCommon(targetModuleFilename, item, commonKeys));
        }

        return rewrites;
    }

    #getModuleImportKeys(targetModuleFilename: string, item: ESImport | ESExport): ModuleImportKeys
    {
        const moduleSegmentKeys = this.#getSegmentImportKeys(targetModuleFilename, this.#segment);
        const moduleRemoteKeys = this.#getRemoteImportKeys(targetModuleFilename, moduleSegmentKeys);

        const segmentKeys = this.#filterMemberKeys(item, moduleSegmentKeys);
        const remoteKeys = this.#filterMemberKeys(item, moduleRemoteKeys);
        const commonKeys = this.#extractUnsegmentedImportKeys(item, [...segmentKeys, ...remoteKeys]);

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

    #filterMemberKeys(item: ESImport | ESExport, keys: string[]): string[]
    {
        return item.members
            .filter(member => keys.includes(member.identifier))
            .map(member => member.identifier);
    }

    #extractUnsegmentedImportKeys(item: ESImport | ESExport, segmentedKeys: string[]): string[]
    {
        return item.members
            .filter(member => segmentedKeys.includes(member.identifier) === false)
            .map(member => member.identifier);
    }

    #rewriteToSegment<T extends (ESImport | ESExport)>(targetModuleFilename: string, item: ESImport | ESExport, keys: string[]): T
    {
        const clone = item.clone() as T;

        clone.from = this.#rewriteApplicationFrom(targetModuleFilename, this.#segment?.name);
        clone.members = this.#filterMembers(item.members, keys);

        return clone;
    }

    #rewriteToRemote<T extends (ESImport | ESExport)>(targetModuleFilename: string, item: ESImport | ESExport, keys: string[]): T
    {
        const clone = item.clone() as T;

        clone.from = this.#rewriteApplicationFrom(targetModuleFilename, 'remote');
        clone.members = this.#filterMembers(item.members, keys);

        return clone;
    }

    #rewriteToCommon<T extends (ESImport | ESExport)>(targetModuleFilename: string, item: ESImport | ESExport, keys: string[]): T
    {
        const clone = item.clone() as T;

        clone.from = this.#rewriteApplicationFrom(targetModuleFilename);
        clone.members = this.#filterMembers(item.members, keys);

        return clone;
    }

    #filterMembers(members: ESModuleMember[], keys: string[]): ESModuleMember[]
    {
        const filtered = [];
        
        for (const key of keys)
        {
            const member = members.find(member => member.identifier === key);

            if (member === undefined)
            {
                continue;
            }

            filtered.push(member);
        }

        return filtered;
    }

    #rewriteApplicationFrom(filename: string, scope?: string): string
    {
        const callingModulePath = this.#fileHelper.extractPath(this.#module.filename);
        const relativeFilename = this.#fileHelper.makePathRelative(filename, callingModulePath);

        return scope !== undefined
            ? this.#fileHelper.addSubExtension(relativeFilename, scope)
            : relativeFilename;
    }
}
