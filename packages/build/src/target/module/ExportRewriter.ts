
import type { ESExport } from '@jitar/analysis';

import { Patterns, Values } from '../../definitions';

import LocationRewriter from './LocationRewriter';

export default class ExportRewriter extends LocationRewriter
{
    get replacementPattern() { return Patterns.EXPORT; }

    parseStatement(statement: string): ESExport
    {
        return this.parser.parseExport(statement);
    }

    includeInBundle(dependency: ESExport, from: string, keys: string[]): string
    {
        if (dependency.members.length === 0)
        {
            return `export "${from}";`;
        }

        const members = this.#rewriteStaticExportMembers(dependency, keys);

        return `export ${members} from "${from}";`;
    }

    excludeFromBundle(dependency: ESExport, from: string): string
    {
        // Exports cannot be excluded from the bundle.

        // This only called when a resource module is re-exported from an application module.
        // Although the resource module is not included in the bundle, the re-exported module is.
        // Depending on the situation, this is desired, but is most likely a configuration error.

        const keys = dependency.members.map(member => member.identifier);

        return this.includeInBundle(dependency, from, keys);
    }

    #rewriteStaticExportMembers(dependency: ESExport, keys: string[]): string
    {
        const members = dependency.members.filter(member => keys.includes(member.identifier));

        if (members.length === 1 && members[0].identifier === '')
        {
            const member = members[0];

            return member.alias !== undefined ? `${Values.ASTERISK} as ${member.alias}` : Values.ASTERISK;
        }

        const memberExports = members.map(member => member.alias !== undefined ? `${member.identifier} as ${member.alias}` : member.identifier);

        return `{ ${memberExports.join(', ')} }`;
    }
}
