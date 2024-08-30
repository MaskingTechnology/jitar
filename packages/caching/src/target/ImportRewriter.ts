
import { Reflector } from '@jitar/reflection';
import type { ReflectionImport } from '@jitar/reflection';

import type { Module, Segmentation, Segment } from '../source';
import { FileHelper } from '../utils';

const KEYWORD_DEFAULT = 'default';
const IMPORT_PATTERN = /import\s(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s]*([@\w/._-]+)["'\s].*/g;
const APPLICATION_MODULE_INDICATORS = ['.', '/', 'http:', 'https:'];

const reflector = new Reflector();

export default class ImportRewriter
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

    rewrite(): string
    {
        const replacer = (statement: string) => this.#replaceImport(statement);

        const code = this.#module.code;

        return code.replaceAll(IMPORT_PATTERN, replacer);
    }

    #replaceImport(statement: string): string
    {
        const dependency = reflector.parseImport(statement);

        return this.#isApplicationModule(dependency)
            ? this.#rewriteApplicationImport(dependency)
            : this.#rewriteRuntimeImport(dependency);
    }

    #isApplicationModule(dependency: ReflectionImport): boolean
    {
        return APPLICATION_MODULE_INDICATORS.some(indicator => dependency.from.startsWith(indicator, 1));
    }

    #rewriteApplicationImport(dependency: ReflectionImport): string
    {
        const targetModuleFilename = this.#getTargetModuleFilename(dependency);

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

        // import shared (unsegmented) module

        const from = this.#rewriteApplicationFrom(targetModuleFilename, 'shared');

        return this.#segment === undefined
            ? this.#rewriteToStaticImport(dependency, from) // shared to shared
            : this.#rewriteToDynamicImport(dependency, from); // segmented to shared (prevent bundling)
    }

    #rewriteRuntimeImport(dependency: ReflectionImport): string
    {
        const from = this.#rewriteRuntimeFrom(dependency);

        return this.#rewriteToStaticImport(dependency, from);
    }

    #rewriteApplicationFrom(filename: string, scope: string): string
    {
        const callingModulePath = FileHelper.extractPath(this.#module.filename);
        const relativeFilename = FileHelper.makePathRelative(filename, callingModulePath);
        
        return FileHelper.addSubExtension(relativeFilename, scope);
    }

    #rewriteRuntimeFrom(dependency: ReflectionImport): string
    {
        return this.#stripFrom(dependency.from);
    }

    #rewriteToStaticImport(dependency: ReflectionImport, from: string): string
    {
        if (dependency.members.length === 0)
        {
            return `import "${from}";`;
        }

        const members = this.#rewriteStaticImportMembers(dependency);

        return `import ${members} from "${from}";`;
    }

    #rewriteToDynamicImport(dependency: ReflectionImport, from: string): string
    {
        if (dependency.members.length === 0)
        {
            return `await import("${from}");`;
        }

        const members = this.#rewriteDynamicImportMembers(dependency);

        return `const ${members} = await import("${from}");`;
    }

    #rewriteStaticImportMembers(dependency: ReflectionImport): string
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

    #rewriteDynamicImportMembers(dependency: ReflectionImport): string
    {
        if (this.#doesImportAll(dependency))
        {
            return dependency.members[0].as;
        }

        const members = dependency.members;
        const memberImports = members.map(member => member.name !== member.as ? `${member.name} : ${member.as}` : member.name);

        return `{ ${memberImports.join(', ')} }`;
    }

    #getTargetModuleFilename(dependency: ReflectionImport): string
    {
        const from = this.#stripFrom(dependency.from);
        const callingModulePath = FileHelper.extractPath(this.#module.filename);
        const translated = FileHelper.makePathAbsolute(from, callingModulePath);

        return FileHelper.assureExtension(translated);
    }

    #doesImportAll(dependency: ReflectionImport): boolean
    {
        return dependency.members.length === 1
            && dependency.members[0].name === '*';
    }

    #stripFrom(from: string): string
    {
        return from.substring(1, from.length - 1);
    }
}
