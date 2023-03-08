
import Segment from './models/Segment.js';
import SegmentCache from './models/SegmentCache.js';
import SegmentImport from './models/SegmentImport.js';
import SegmentProcedure from './models/SegmentProcedure.js';

export default class SegmentCacheBuilder
{
    build(segment: Segment): SegmentCache
    {
        const files = this.#extractFiles(segment);
        const imports = this.#createImports(segment);
        const procedures = this.#mergeProcedures(segment);

        return new SegmentCache(segment.name, files, imports, procedures);
    }

    #extractFiles(segment: Segment): string[]
    {
        return segment.modules.map(module => module.filename);
    }

    #createImports(segment: Segment): SegmentImport[]
    {
        const imports = [];

        for (const module of segment.modules)
        {
            let members: string[] = [];

            for (const procedure of module.procedures)
            {
                const ids = procedure.implementations.map(implementation => implementation.id);

                members = [...members, ...ids];
            }

            imports.push(new SegmentImport(members, module.filename));
        }

        return imports;
    }

    #mergeProcedures(segment: Segment): SegmentProcedure[]
    {
        const procedures = new Map<string, SegmentProcedure>();

        for (const module of segment.modules)
        {
            for (const procedure of module.procedures)
            {
                if (procedures.has(procedure.fqn))
                {
                    const existingProcedure = procedures.get(procedure.fqn) as SegmentProcedure;

                    for (const implementation of procedure.implementations)
                    {
                        existingProcedure.addImplementation(implementation);
                    }

                    continue;
                }
                
                procedures.set(procedure.fqn, procedure);
            }
        }

        return [...procedures.values()];
    }
}
