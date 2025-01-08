
import { Parser } from '@jitar/analysis';
import type { ESImport } from '@jitar/analysis';

import type { Module, Segmentation, Segment, ResourcesList } from '../../source';
import { FileHelper, LocationReplacer } from '../../utils';

const KEYWORD_DEFAULT = 'default';

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

        // if target module is a resource, always import as dynamic to prevent bundling

        if (this.#resources.isResourceModule(targetModuleFilename))
        {
            const from = this.#rewriteApplicationFrom(targetModuleFilename);

            return this.#rewriteToDynamicImport(dependency, from);
        }

        // the other imports are always static (bundled)

        if (this.#segmentation.isSegmentedModule(targetModuleFilename))
        {
            // import segmented module

            if (this.#segment?.hasModule(targetModuleFilename))
            {
                const from = this.#rewriteApplicationFrom(targetModuleFilename, this.#segment.name);

                return this.#rewriteToStaticImport(dependency, from); // same segment
            }

            const from = this.#rewriteApplicationFrom(targetModuleFilename, 'remote');

            return this.#rewriteToStaticImport(dependency, from); // different segments
        }

        // import common (unsegmented) module

        const from = this.#rewriteApplicationFrom(targetModuleFilename);

        return this.#rewriteToStaticImport(dependency, from);
    }

    #rewriteRuntimeImport(dependency: ESImport): string
    {
        const from = this.#rewriteRuntimeFrom(dependency);

        return this.#rewriteToStaticImport(dependency, from);
    }

    #rewriteApplicationFrom(filename: string, scope?: string): string
    {
        const callingModulePath = this.#fileHelper.extractPath(this.#module.filename);
        const relativeFilename = this.#fileHelper.makePathRelative(filename, callingModulePath);

        return scope === undefined
            ? relativeFilename
            : this.#fileHelper.addSubExtension(relativeFilename, scope);
    }

    #rewriteRuntimeFrom(dependency: ESImport): string
    {
        return this.#fileHelper.stripPath(dependency.from);
    }

    #rewriteToStaticImport(dependency: ESImport, from: string): string
    {
        if (dependency.members.length === 0)
        {
            return `import "${from}";`;
        }

        const members = this.#rewriteStaticImportMembers(dependency);

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

    #rewriteStaticImportMembers(dependency: ESImport): string
    {
        const defaultMember = dependency.members.find(member => member.name === KEYWORD_DEFAULT);
        const hasDefaultMember = defaultMember !== undefined;
        const defaultMemberImport = hasDefaultMember ? defaultMember.as : '';

        const namedMembers = dependency.members.filter(member => member.name !== KEYWORD_DEFAULT);
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

    #doesImportAll(dependency: ESImport): boolean
    {
        return dependency.members.length === 1
            && dependency.members[0].name === '*';
    }
}
