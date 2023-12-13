
import DuplicateImplementation from './errors/DuplicateImplementation.js';
import Segment from './models/Segment.js';
import SegmentCache from './models/SegmentCache.js';
import SegmentImplementation from './models/SegmentImplementation.js';
import SegmentImport from './models/SegmentImport.js';
import SegmentProcedure from './models/SegmentProcedure.js';

export default class SegmentCacheBuilder
{
    build(segment: Segment): SegmentCache
    {
        const files = this.#extractFiles(segment);
        const imports = this.#createImports(segment);
        const procedures = this.#mergeProcedures(segment);

        this.#validateProcedures(procedures);

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
                const ids = procedure.implementations.map(implementation => this.#createImportMember(implementation));

                members = [...members, ...ids];
            }

            imports.push(new SegmentImport(members, module.filename));
        }

        return imports;
    }

    #createImportMember(implementation: SegmentImplementation): string
    {
        return `${implementation.importKey} : ${implementation.id}`;
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

                const procedureCopy = new SegmentProcedure(procedure.fqn, [...procedure.implementations]);

                procedures.set(procedure.fqn, procedureCopy);
            }
        }

        return [...procedures.values()];
    }

    #validateProcedures(procedures: SegmentProcedure[]): void
    {
        for (const procedure of procedures)
        {
            this.#checkForDuplicateImplementations(procedure);
        }
    }

    #checkForDuplicateImplementations(procedure: SegmentProcedure): void
    {
        for (const implementation of procedure.implementations)
        {
            const duplicate = procedure.implementations.find(other => 
            {
                return other.id !== implementation.id
                    && other.version === implementation.version;
            });

            if (duplicate !== undefined)
            {
                throw new DuplicateImplementation(procedure.fqn, implementation.version);
            }
        }
    }
}
