
import { ExecutionScopes } from '../definitions/ExecutionScope.js';
import { createNodeFilename } from '../definitions/Files.js';

import ImplementationNotFound from '../errors/ImplementationNotFound.js';
import ProcedureNotFound from '../errors/ProcedureNotFound.js';

import Procedure from '../models/Procedure.js';
import Request from '../models/Request.js';
import Response from '../models/Response.js';
import Segment from '../models/Segment.js';
import ArgumentConstructor from '../utils/ArgumentConstructor.js';

import Gateway from './Gateway.js';
import Node from './Node.js';
import Repository from './Repository.js';

import { setRuntime } from '../hooks.js';

export default class LocalNode extends Node
{
    #segmentNames: string[];
    #argumentConstructor: ArgumentConstructor;
    #segments: Map<string, Segment> = new Map();
    #gateway?: Gateway;

    constructor(segmentNames: string[], repository: Repository, gateway?: Gateway, url?: string, argumentConstructor = new ArgumentConstructor())
    {
        super(repository, url);

        this.#segmentNames = segmentNames;
        this.#gateway = gateway;
        this.#argumentConstructor = argumentConstructor;

        setRuntime(this);
    }

    getProcedureNames(): string[]
    {
        const names: Set<string> = new Set();

        for (const segment of this.#segments.values())
        {
            // We only expose the public procedures
            // to protect access to private procedures

            const procedures = segment.getPublicProcedures();

            procedures.forEach(procedure => names.add(procedure.fqn));
        }

        return [...names.values()];
    }

    async loadSegment(name: string): Promise<void>
    {
        const filename = createNodeFilename(name);
        const module = await this.import(filename, ExecutionScopes.APPLICATION);
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

    async start(): Promise<void>
    {
        await this.repository.start();

        await this.#loadSegments();

        if (this.#gateway !== undefined)
        {
            await this.#gateway.start();
        }
    }

    async stop(): Promise<void>
    {
        await this.repository.stop();
        
        this.#unloadSegments();
        
        if (this.#gateway !== undefined)
        {
            await this.#gateway.stop();
        }
    }

    run(request: Request): Promise<Response>
    {
        const procedure = this.#getProcedure(request.fqn);

        return procedure === undefined
            ? this.#useGateway(request)
            : this.#runProcedure(procedure, request);
    }

    async #loadSegments()
    {
        for (const segmentName of this.#segmentNames)
        {
            await this.loadSegment(segmentName);
        }
    }

    #unloadSegments(): void
    {
        this.#segments.clear();
    }

    #useGateway(request: Request): Promise<Response>
    {
        if (this.#gateway === undefined)
        {
            throw new ProcedureNotFound(request.fqn);
        }

        return this.#gateway.run(request);
    }

    async #runProcedure(procedure: Procedure, request: Request): Promise<Response>
    {
        const implementation = procedure.getImplementation(request.version);

        if (implementation === undefined)
        {
            throw new ImplementationNotFound(procedure.fqn, request.version.toString());
        }

        const values: unknown[] = this.#argumentConstructor.extract(implementation.parameters, request.args);

        const result = await implementation.executable.call(request, ...values);

        return new Response(result);
    }

    #getProcedure(fqn: string): Procedure | undefined
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
}
