
import { SourcingManager } from '@jitar/sourcing';

import ImplementationNotFound from './errors/ImplementationNotFound';
import InvalidSegmentFile from './errors/InvalidSegmentFile';
import ProcedureNotFound from './errors/ProcedureNotFound';
import Runner from './interfaces/Runner';
import Request from './models/Request';
import Response from './models/Response';
import Segment from './models/Segment';
import Procedure from './models/Procedure';
import ArgumentConstructor from './utils/ArgumentConstructor';

export default class ExecutionManager implements Runner
{
    #sourcingManager: SourcingManager;
    #argumentConstructor: ArgumentConstructor = new ArgumentConstructor();
    #segments: Map<string, Segment> = new Map();

    constructor(sourcingManager: SourcingManager)
    {
        this.#sourcingManager = sourcingManager;
    }

    async importSegment(filename: string): Promise<void>
    {
        const module = await this.#sourcingManager.import(filename);

        if (module.segment === undefined)
        {
            throw new InvalidSegmentFile(filename);
        }

        const segment = module.segment as Segment;

        this.addSegment(segment);
    }

    addSegment(segment: Segment): void
    {
        this.#segments.set(segment.id, segment);
    }

    hasProcedure(fqn: string): boolean
    {
        const procedureNames = this.getProcedureNames();

        return procedureNames.includes(fqn);
    }

    getProcedureNames(): string[]
    {
        const names: Set<string> = new Set();

        for (const segment of this.#segments.values())
        {
            // We only expose the public and protected procedures
            // to protect access to private procedures

            const procedures = segment.getExposedProcedures();

            procedures.forEach(procedure => names.add(procedure.fqn));
        }

        return [...names.values()];
    }

    getProcedure(fqn: string): Procedure | undefined
    {
        for (const segment of this.#segments.values())
        {
            if (segment.hasProcedure(fqn))
            {
                return segment.getProcedure(fqn);
            }
        }

        return undefined;
    }

    async run(request: Request): Promise<Response>
    {
        const procedure = this.getProcedure(request.fqn);

        if (procedure === undefined)
        {
            throw new ProcedureNotFound(request.fqn);
        }

        const implementation = procedure.getImplementation(request.version);

        if (implementation === undefined)
        {
            throw new ImplementationNotFound(procedure.fqn, request.version.toString());
        }

        const values: unknown[] = this.#argumentConstructor.extract(implementation.parameters, request.args);

        const result = await implementation.executable.call(request, ...values);

        return new Response(result);
    }
}
