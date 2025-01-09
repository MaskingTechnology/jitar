
import { Parser } from '@jitar/analysis';
import type { ESImport } from '@jitar/analysis';

import type { Module, Segmentation, Segment, ResourcesList } from '../../source';
import { FileHelper, LocationReplacer } from '../../utils';

const KEYWORD_DEFAULT = 'default';

type ModuleImportKeys = { segmentKeys: string[], remoteKeys: string[], commonKeys: string[] };

export default class ImportRewriter
{
    readonly #module: Module;
    readonly #resources: ResourcesList;
    readonly #segmentation: Segmentation;
    readonly #segment: Segment | undefined;

    readonly #parser = new Parser();
    readonly #fileHelper = new FileHelper();
    readonly #locationReplacer = new LocationReplacer();

    constructor(module: Module, resources: ResourcesList, segmentation: Segmentation, segment?: Segment)
    {
        this.#module = module;
        this.#resources = resources;
        this.#segmentation = segmentation;
        this.#segment = segment;
    }

    rewrite(code: string): string
    {
        const replacer = (statement: string) => this.#replaceImport(statement);

        return this.#locationReplacer.replaceImports(code, replacer);
    }

    #replaceImport(statement: string): string
    {
        const dependency = this.#parser.parseImport(statement);

        return this.#isApplicationModule(dependency)
            ? this.#rewriteApplicationImport(dependency)
            : this.#rewriteRuntimeImport(dependency);
    }

    #isApplicationModule(dependency: ESImport): boolean
    {
        const from = this.#fileHelper.stripPath(dependency.from);

        return this.#fileHelper.isApplicationModule(from);
    }

    #rewriteApplicationImport(dependency: ESImport): string
    {
        const targetModuleFilename = this.#getTargetModuleFilename(dependency);

        if (this.#resources.isResourceModule(targetModuleFilename))
        {
            return this.#rewriteResourceImport(targetModuleFilename, dependency);
        }

        return this.#rewriteModuleImport(targetModuleFilename, dependency);
    }

    #rewriteResourceImport(targetModuleFilename: string, dependency: ESImport): string
    {
        // Resource modules are always imported as dynamic to prevent bundling

        const from = this.#rewriteApplicationFrom(targetModuleFilename);

        return this.#rewriteToDynamicImport(dependency, from);
    }

    #rewriteModuleImport(targetModuleFilename: string, dependency: ESImport): string
    {
        const { segmentKeys, remoteKeys, commonKeys } = this.#getModuleImportKeys(targetModuleFilename, dependency);

        const imports: string[] = [];

        if (segmentKeys.length > 0)
        {
            imports.push(this.#rewriteSegmentImport(targetModuleFilename, dependency, segmentKeys));
        }

        if (remoteKeys.length > 0)
        {
            imports.push(this.#rewriteRemoteImport(targetModuleFilename, dependency, remoteKeys));
        }

        if (commonKeys.length > 0)
        {
            imports.push(this.#rewriteCommonImport(targetModuleFilename, dependency, commonKeys));
        }

        return imports.join('\n');
    }

    #rewriteSegmentImport(targetModuleFilename: string, dependency: ESImport, keys: string[]): string
    {
        const from = this.#rewriteApplicationFrom(targetModuleFilename, this.#segment!.name);

        return this.#rewriteToStaticImport(dependency, from, keys);
    }

    #rewriteRemoteImport(targetModuleFilename: string, dependency: ESImport, keys: string[]): string
    {
        const from = this.#rewriteApplicationFrom(targetModuleFilename, 'remote');

        return this.#rewriteToStaticImport(dependency, from, keys);
    }

    #rewriteCommonImport(targetModuleFilename: string, dependency: ESImport, keys: string[]): string
    {
        const from = this.#rewriteApplicationFrom(targetModuleFilename);

        return this.#rewriteToStaticImport(dependency, from, keys);
    }

    #rewriteRuntimeImport(dependency: ESImport): string
    {
        const from = this.#rewriteRuntimeFrom(dependency);
        const keys = dependency.members.map(member => member.name);

        return this.#rewriteToStaticImport(dependency, from, keys);
    }

    #rewriteApplicationFrom(filename: string, scope?: string): string
    {
        const callingModulePath = this.#fileHelper.extractPath(this.#module.filename);
        const relativeFilename = this.#fileHelper.makePathRelative(filename, callingModulePath);

        return scope !== undefined
            ? this.#fileHelper.addSubExtension(relativeFilename, scope)
            : relativeFilename;
    }

    #rewriteRuntimeFrom(dependency: ESImport): string
    {
        return this.#fileHelper.stripPath(dependency.from);
    }

    #rewriteToStaticImport(dependency: ESImport, from: string, keys: string[]): string
    {
        if (dependency.members.length === 0)
        {
            return `import "${from}";`;
        }

        const members = this.#rewriteStaticImportMembers(dependency, keys);

        return `import ${members} from "${from}";`;
    }

    #rewriteToDynamicImport(dependency: ESImport, from: string): string
    {
        if (dependency.members.length === 0)
        {
            return `await import("${from}");`;
        }

        const members = this.#rewriteDynamicImportMembers(dependency);

        return `const ${members} = await import("${from}");`;
    }

    #rewriteStaticImportMembers(dependency: ESImport, keys: string[]): string
    {
        const members = dependency.members.filter(member => keys.includes(member.name));

        const defaultMember = members.find(member => member.name === KEYWORD_DEFAULT);
        const hasDefaultMember = defaultMember !== undefined;
        const defaultMemberImport = hasDefaultMember ? defaultMember.as : '';

        const namedMembers = members.filter(member => member.name !== KEYWORD_DEFAULT);
        const namedMemberImports = namedMembers.map(member => member.name !== member.as ? `${member.name} as ${member.as}` : member.name);
        const hasNamedMembers = namedMemberImports.length > 0;
        const groupedNamedMemberImports = hasNamedMembers ? `{ ${namedMemberImports.join(', ')} }` : '';

        const separator = hasDefaultMember && hasNamedMembers ? ', ' : '';

        return `${defaultMemberImport}${separator}${groupedNamedMemberImports}`;
    }

    #rewriteDynamicImportMembers(dependency: ESImport): string
    {
        if (this.#doesImportAll(dependency))
        {
            return dependency.members[0].as;
        }

        const members = dependency.members;
        const memberImports = members.map(member => member.name !== member.as ? `${member.name} : ${member.as}` : member.name);

        return `{ ${memberImports.join(', ')} }`;
    }

    #getTargetModuleFilename(dependency: ESImport): string
    {
        const from = this.#fileHelper.stripPath(dependency.from);
        const callingModulePath = this.#fileHelper.extractPath(this.#module.filename);
        
        return this.#fileHelper.makePathAbsolute(from, callingModulePath);
    }

    #getModuleImportKeys(targetModuleFilename: string, dependency: ESImport): ModuleImportKeys
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

    #extractUnsegmentedImportKeys(dependency: ESImport, segmentedKeys: string[]): string[]
    {
        return dependency.members
            .filter(member => segmentedKeys.includes(member.name) === false)
            .map(member => member.name);
    }

    #doesImportAll(dependency: ESImport): boolean
    {
        return dependency.members.length === 1
            && dependency.members[0].name === '*';
    }
}
