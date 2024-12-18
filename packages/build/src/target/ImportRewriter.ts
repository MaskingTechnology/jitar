
import { Parser } from '@jitar/analysis';
import type { ESImport } from '@jitar/analysis';

import type { Module, Segmentation, Segment, ResourceList } from '../source';
import { FileHelper } from '../utils';

const KEYWORD_DEFAULT = 'default';
const IMPORT_PATTERN = /import\s(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s]*([@\w/._-]+)["'\s].*/g;
const APPLICATION_MODULE_INDICATORS = ['.', '/', 'http:', 'https:'];

export default class ImportRewriter
{
    readonly #resources: ResourceList;
    readonly #module: Module;
    readonly #segmentation: Segmentation;
    readonly #segment: Segment | undefined;

    readonly #parser = new Parser();
    readonly #fileHelper = new FileHelper();

    constructor(resources: ResourceList, module: Module, segmentation: Segmentation, segment?: Segment)
    {
        this.#resources = resources;
        this.#module = module;
        this.#segmentation = segmentation;
        this.#segment = segment;
    }

    rewrite(code: string): string
    {
        const replacer = (statement: string) => this.#replaceImport(statement);

        return code.replaceAll(IMPORT_PATTERN, replacer);
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
        return APPLICATION_MODULE_INDICATORS.some(indicator => dependency.from.startsWith(indicator, 1));
    }

    #rewriteApplicationImport(dependency: ESImport): string
    {
        const targetModuleFilename = this.#getTargetModuleFilename(dependency);

        // if target module is a resource, always import as dynamic to prevent bundling

        if (this.#resources.isModuleResource(targetModuleFilename))
        {
            const from = this.#rewriteApplicationFrom(targetModuleFilename);

            return this.#rewriteToDynamicImport(dependency, from);
        }

        // the other imports are always static (bundled)

        if (this.#segmentation.isModuleSegmented(targetModuleFilename))
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

        const from = this.#rewriteApplicationFrom(targetModuleFilename, 'common');

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
        return this.#stripFrom(dependency.from);
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
        const from = this.#stripFrom(dependency.from);
        const callingModulePath = this.#fileHelper.extractPath(this.#module.filename);
        const translated = this.#fileHelper.makePathAbsolute(from, callingModulePath);

        return this.#fileHelper.assureExtension(translated);
    }

    #doesImportAll(dependency: ESImport): boolean
    {
        return dependency.members.length === 1
            && dependency.members[0].name === '*';
    }

    #stripFrom(from: string): string
    {
        return from.substring(1, from.length - 1);
    }
}
