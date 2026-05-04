
import type { ESImport } from '@jitar/analysis';

import { Patterns, Keywords, Values } from '../../definitions';

import LocationRewriter from './LocationRewriter';

export default class ImportRewriter extends LocationRewriter
{
    get replacementPattern() { return Patterns.IMPORT; }

    parseStatement(statement: string): ESImport
    {
        return this.parser.parseImport(statement);
    }

    includeInBundle(dependency: ESImport, from: string, keys: string[]): string
    {
        if (dependency.members.length === 0)
        {
            return `import "${from}";`;
        }

        const members = this.#rewriteStaticImportMembers(dependency, keys);

        return `import ${members} from "${from}";`;
    }

    excludeFromBundle(dependency: ESImport, from: string): string
    {
        // Dynamic imports are used to distinct excludes from includes.
        // This has to be configured in the bundler, in case this isn't the default behavior.

        if (dependency.members.length === 0)
        {
            return `await import("${from}");`;
        }

        const members = this.#rewriteDynamicImportMembers(dependency);

        return `const ${members} = await import("${from}");`;
    }

    #rewriteStaticImportMembers(dependency: ESImport, keys: string[]): string
    {
        const members = dependency.members.filter(member => keys.includes(member.identifier));

        const defaultMember = members.find(member => member.identifier === Keywords.DEFAULT);
        const hasDefaultMember = defaultMember !== undefined;
        const defaultMemberImport = hasDefaultMember ? defaultMember.alias : '';

        const namedMembers = members.filter(member => member.identifier !== Keywords.DEFAULT);
        const namedMemberImports = namedMembers.map(member => member.alias !== undefined ? `${member.identifier} as ${member.alias}` : member.identifier);
        const hasNamedMembers = namedMemberImports.length > 0;
        const groupedNamedMemberImports = hasNamedMembers ? `{ ${namedMemberImports.join(', ')} }` : '';

        const separator = hasDefaultMember && hasNamedMembers ? ', ' : '';

        return `${defaultMemberImport}${separator}${groupedNamedMemberImports}`;
    }

    #rewriteDynamicImportMembers(dependency: ESImport): string
    {
        if (this.#doesImportAll(dependency))
        {
            const member = dependency.members[0];

            return member.alias ?? member.identifier;
        }

        const members = dependency.members;
        const memberImports = members.map(member => member.alias !== undefined ? `${member.identifier} : ${member.alias}` : member.identifier);

        return `{ ${memberImports.join(', ')} }`;
    }

    #doesImportAll(dependency: ESImport): boolean
    {
        return dependency.members.length === 1
            && dependency.members[0].identifier === Values.ASTERISK;
    }
}
